import {app, BrowserWindow} from 'electron';
import {autoUpdater} from 'electron-updater';
import log from 'electron-log';
import {server, init, connectElectron} from './server';
import * as pkg from '../package.app.electron.json';
const IS_DEV = process.env.NODE_ENV === 'development';
const PORT = parseInt(process.env.PORT) + (!IS_DEV ? 2000 : 0);

app.commandLine.appendSwitch('force_high_performance_gpu');
app.commandLine.appendSwitch('ignore-certificate-errors');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow;

init();
connectElectron(app, win);

const createWindow = async (port = 3000) => {
  win = new BrowserWindow({
    title: `Hegemon - v${pkg.version}`,
    width: 1920,
    height: 1080,
    minWidth: 1920,
    minHeight: 1080,
    frame: true,
    fullscreen: false,
    resizable: true,
    autoHideMenuBar: true,
    center: true,
    backgroundColor: '#000000',
    show: false,
    webPreferences: {
      webSecurity: true,
      allowRunningInsecureContent: false,
      contextIsolation: true,
      // nodeIntegration: true,
    },
    icon: `${__dirname}/assets/icon.png`,
  });

  if (process.env.WINDOWED) win.maximize();
  win.maximize();
  win.show();
  win.on('closed', () => (win = null));

  if (!IS_DEV) {
    try {
      await autoUpdater.checkForUpdatesAndNotify();
    } catch (err) {
      app.quit();
    }
  }

  win.loadURL(`http://localhost:${port}`);
};

const sendStatusToWindow = (text) => {
  log.info(text);
  win.webContents.send('message', text);
};

if (!IS_DEV) {
  autoUpdater.logger = log;
  // @ts-ignore
  autoUpdater.logger.transports.file.level = 'info';

  log.info('App starting...');

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  });
  autoUpdater.on('update-available', () => {
    sendStatusToWindow('Update available.');
  });
  autoUpdater.on('update-not-available', () => {
    sendStatusToWindow('Update not available.');
  });
  autoUpdater.on('error', () => {
    sendStatusToWindow('Error in auto-updater.');
  });
  autoUpdater.on('download-progress', () => {
    sendStatusToWindow('Download progress...');
  });
  autoUpdater.on('update-downloaded', () => {
    sendStatusToWindow('Update downloaded; will install in 5 seconds');
  });
  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  server.listen(PORT, () => createWindow(PORT));
});
