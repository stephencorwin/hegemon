import {exec} from 'child_process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import DotenvWP from 'dotenv-webpack';
import Dotenv from 'dotenv';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import chalk from 'chalk';
import _ from './base.js';
import pkg from '../package.app.electron.json' with {type: 'json'};

const __dirname = import.meta.dirname;
const OUT = `${_.PATHS.OUT}/${_.IS_DEV ? 'app.dev' : 'app'}`;
const ENV = `${_.PATHS.ENV}/${_.IS_DEV ? 'app.dev' : 'app'}`;
Dotenv.config({path: ENV});

let initialized = false;

const ELECTRON_CONFIG = {
  ..._.BASE_CONFIG,
  name: 'electron',
  target: 'node',
  node: {__dirname: true},
  entry: {electron: `${_.PATHS.APP}/electron.ts`},
  output: {
    path: OUT,
    filename: '[name].js',
  },
  externals: _.nodeExternals(),
  module: {
    rules: [_.BABEL_CONFIG()],
  },
  plugins: [
    ..._.BASE_PLUGINS({out: OUT}),
    new CleanWebpackPlugin(),
    new DotenvWP({path: ENV}),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${_.PATHS.ROOT}/package.app.electron.json`,
          to: `${OUT}/package.json`,
          toType: 'file',
        },
        {from: _.PATHS.ASSETS, to: `${OUT}/assets`},
      ],
    }),
  ].filter(Boolean),
};

const REACT_APP_CONFIG = {
  ..._.BASE_CONFIG,
  name: 'react app',
  target: 'web',
  entry: [`${_.PATHS.APP}/index.tsx`],
  output: {
    path: OUT,
    filename: '[name].[fullhash].js',
  },
  module: {
    rules: [
      _.BABEL_CONFIG({}),
      {
        test: /\.html$/,
        loader: 'file-loader',
        include: _.PATHS.APP,
      },
    ],
  },
  plugins: [
    ..._.BASE_PLUGINS({out: OUT}),
    new DotenvWP({path: ENV}),
    new HtmlWebpackPlugin({
      template: `${_.PATHS.APP}/index.html`,
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('Compliation Finished', () => {
          console.info(`${chalk.blueBright('[app]')} compilation complete`);
        });
      },
    },
    _.IS_DEV && {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('Launch Electron', () => {
          if (initialized) return;
          initialized = true;

          console.info(`${chalk.blueBright('[app]')} launching electron`);
          exec(`electron ${OUT}/electron.js`, (err, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
        });
      },
    },
    !_.IS_DEV && {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('Pack Electron', () => {
          exec(
            `electron-builder --project=${OUT} --publish ${process.env.DEPLOY ? 'always' : 'never'}${
              process.env.LINUX ? ' --linux' : ''
            }`,
            async (err, stdout, stderr) => {
              if (stdout) process.stdout.write(stdout);
              if (stderr) process.stderr.write(stderr);
              console.info(
                `${chalk.blueBright('[app]')} ${pkg.version} packed`
              );
            }
          );
        });
      },
    },
  ].filter(Boolean),
};

export default [ELECTRON_CONFIG, REACT_APP_CONFIG];
