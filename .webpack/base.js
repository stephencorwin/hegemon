import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
const __dirname = import.meta.dirname;
const IS_DEV = process.env.NODE_ENV !== 'production';

const ROOT_PATH = path.join(__dirname, '../');

const PATHS = {
  ROOT: ROOT_PATH,
  OUT: `${ROOT_PATH}/.webpack.build`,
  DIST: `${ROOT_PATH}/.webpack.dist`,
  ENV: `${ROOT_PATH}/.env`,
  APP: `${ROOT_PATH}/app`,
  ASSETS: `${ROOT_PATH}/assets`,
};

const nodeExternals = () =>
  fs.readdirSync('node_modules').reduce((acc, mod) => {
    if (['.bin'].indexOf(mod) !== -1) return acc;
    acc[mod] = 'commonjs ' + mod;
    return acc;
  }, {});

const BABEL_CONFIG = ({presets = [], plugins = [], modules = false} = {}) => ({
  test: /\.m?[jt]sx?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    presets: [
      ...presets,
      [
        '@babel/preset-env',
        {modules, targets: {browsers: 'last 1 chrome versions', node: true}},
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ].filter(Boolean),
    plugins: [...plugins, '@babel/plugin-proposal-class-properties'].filter(
      Boolean
    ),
  },
});

const BASE_PLUGINS = ({out = PATHS.OUT}) => [
  new webpack.ProgressPlugin(),
  new webpack.DefinePlugin({
    __dirname: IS_DEV ? `'${out.split('\\').join('\\\\')}'` : '__dirname',
  }),
];

const BASE_CONFIG = {
  context: PATHS.ROOT,
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'inline-source-map' : undefined,
  resolve: {
    modules: ['node_modules'],
    extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
    // alias: ALIASES,
  },
  plugins: BASE_PLUGINS,
  performance: {
    hints: false,
  },
};

export default {
  IS_DEV,
  PATHS,
  BABEL_CONFIG,
  BASE_CONFIG,
  BASE_PLUGINS,
  nodeExternals,
};
