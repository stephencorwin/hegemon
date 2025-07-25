import express from 'express';
import cors from 'cors';
import request from 'request';
import fs from 'fs';
import path from 'path';
import pkg from '../../package.app.electron.json';
import {
  IFileProfile,
  IFileProfiles,
  IFileWeeklySentiment,
  ISingleFileProfile,
} from '../types';
import {getProfileFileName} from './utils';
import {DEFAULT_PROFILE} from '../mock/defaultProfile';

export const server = express();

export function init() {
  server.use(express.json()); // for parsing application/json
  server.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
  server.use(/(.*)/, cors());
  server.get('/proxy', (req, res) => {
    if (!req.query.url) return;

    // @ts-ignore
    request(decodeURIComponent(req.query.url)).pipe(res);
  });

  server.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile('index.html', {root: __dirname});
  });

  server.use(
    express.static(__dirname, {
      setHeaders: (res) => {
        res.set('Cache-Control', 'public, max-age=604800');
      },
    })
  );

  // createActions({server});
}

export function connectElectron(app, win) {
  server.post('/electron/maximize', (req, res) => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
    res.end();
  });

  server.post('/electron/minimize', (req, res) => {
    win.minimize();
    res.end();
  });

  server.post('/electron/close', (req, res) => {
    win.close();
    res.end();
  });

  server.post('/electron/reload', (req, res) => {
    win.reload();
    res.end();
  });

  server.post('/electron/show', (req, res) => {
    win.show();
    res.end();
  });

  server.post('/electron/hide', (req, res) => {
    win.hide();
    res.end();
  });
  0;

  const appDataPath = path.join(app.getPath('appData'), pkg.name);
  const dataPath = path.join(appDataPath, 'data');

  // ensure that the directory exists
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, {recursive: true});
  }

  function readFile<T>(pathname: string): T {
    if (!fs.existsSync(pathname)) {
      return null;
    }

    const data = fs.readFileSync(pathname, 'utf-8');
    if (!data) return null;

    return JSON.parse(data);
  }

  function writeFile<T>(pathname: string, data: T) {
    if (!data) return;

    fs.writeFileSync(
      path.join(pathname),
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  }

  server.get('/profiles', (req, res) => {
    const profiles =
      readFile<IFileProfiles>(path.join(dataPath, 'profiles.json')) ?? [];

    res.send(JSON.stringify({profiles}));
    res.end();
  });

  server.post('/profile/register', (req, res) => {
    const profileRequestData: ISingleFileProfile & {overwrite?: boolean} = {
      id: req.body?.id,
      apiKey: req.body?.apiKey,
      isPaper: req.body?.isPaper !== undefined ? req.body.isPaper : false,
      overwrite: req.body?.overwrite !== undefined ? req.body.overwrite : false,
    };

    if (!profileRequestData.id || !profileRequestData.apiKey) return;

    const profiles =
      readFile<IFileProfiles>(path.join(dataPath, 'profiles.json')) ?? [];

    // add to the list of tracked profiles
    if (!profiles.find((profile) => profile.id === profileRequestData.id)) {
      profiles.push({
        id: profileRequestData.id,
        apiKey: profileRequestData.apiKey,
        isPaper: profileRequestData.isPaper,
      });
    }
    writeFile<IFileProfiles>(path.join(dataPath, 'profiles.json'), profiles);

    // create or update the existing profile
    const existingProfile = (!profileRequestData.overwrite &&
      readFile<IFileProfile>(
        path.join(dataPath, getProfileFileName(profileRequestData.id))
      )) ?? {macros: {}, settings: {}};
    writeFile<IFileProfile>(
      path.join(dataPath, getProfileFileName(profileRequestData.id)),
      {
        ...existingProfile,
        id: profileRequestData.id,
        macros: Object.keys(existingProfile.macros ?? {}).length
          ? existingProfile.macros
          : DEFAULT_PROFILE.macros,
        settings: Object.keys(existingProfile.settings ?? {}).length
          ? existingProfile.settings
          : DEFAULT_PROFILE.settings,
      } as IFileProfile
    );
    res.end();
  });

  server.post('/profile/unregister', (req, res) => {
    const profileRequestData = {
      id: req.body?.id,
    };

    if (!profileRequestData.id) return;

    const profiles =
      readFile<IFileProfiles>(path.join(dataPath, 'profiles.json')) ?? [];

    // removes the profile from the list
    const newData = profiles.filter(
      (profile) => profile.id !== profileRequestData.id
    );

    writeFile<IFileProfiles>(path.join(dataPath, 'profiles.json'), newData);
    res.end();
  });

  server.get('/data', (req, res) => {
    const id = req.query.id;

    const response: {
      profile?: IFileProfile;
      weeklySentiment?: IFileWeeklySentiment;
    } = {};

    if (id) {
      const profile = readFile<IFileProfile>(
        path.join(dataPath, getProfileFileName(id))
      );
      response.profile = profile;
    }

    const weeklySentiment = readFile<IFileWeeklySentiment>(
      path.join(dataPath, 'weekly-sentiment.json')
    );
    response.weeklySentiment = weeklySentiment;

    res.send(JSON.stringify(response));
    res.end();
  });

  server.post('/data', (req, res) => {
    const profileRequestData: IFileProfile = req.body?.profile;
    const weeklySentimentData = req.body?.weeklySentiment;

    if (profileRequestData) {
      // persist profile data
      writeFile<IFileProfile>(
        path.join(dataPath, getProfileFileName(profileRequestData.id)),
        {
          id: profileRequestData.id,
          macros: profileRequestData.macros,
          settings: profileRequestData.settings,
        } as IFileProfile
      );
    }

    if (weeklySentimentData) {
      const weeklySentimentHistory =
        readFile<IFileProfiles>(path.join(dataPath, 'weekly-sentiment.json')) ??
        {};

      writeFile(path.join(dataPath, 'weekly-sentiment.json'), {
        ...weeklySentimentHistory,
        ...req.body.weeklySentiment,
      });
    }

    res.end();
  });
}
