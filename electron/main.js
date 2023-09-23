const electron = require('electron');
const path = require('path');
const fs = require('fs');
const node_pty = require('node-pty');
const validator = require('validator');
const {
  localDumpDataPath,
  runningOnWindows,
  ipc,
} = require('./electronConstants');

const inDevelopment = process.env.NODE_ENV === 'development';

if (inDevelopment) {
  var {
    default: installDevToolExtension,
    REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS,
  } = require('electron-devtools-installer');
  const path = require('path');
  require('electron-reload')(path.join(__dirname, '..', 'dist'));
}

async function installDevToolExtensions() {
  if (inDevelopment) {
    await installDevToolExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], {
      loadExtensionOptions: { allowFileAccess: true },
      forceDownload: false,
    });
  }
}

const shell = runningOnWindows ? 'powershell.exe' : 'bash';

const terminals = {};

electron.ipcMain.on(ipc.console.create, (evt, id, folderPath) => {
  const fullFolderPath = `${localDumpDataPath}/${folderPath || ''}`;

  fs.mkdirSync(fullFolderPath, { recursive: true });

  let ptyProcess = node_pty.spawn(shell, [], {
    name: 'xterm-color',
    cwd: fs.existsSync(fullFolderPath) ? fullFolderPath : localDumpDataPath,
    env: process.env,
  });

  terminals[id] = ptyProcess;

  const dispose = ptyProcess.onData((data) => {
    if (!terminals[id]) {
      dispose.dispose();
      return;
    }
    mainWindow.webContents.send(`${ipc.console.incomingData}${id}`, data);
  });

  electron.ipcMain.on(`${ipc.console.sendData}${id}`, (evt, data) => {
    ptyProcess.write(data);
  });

  electron.ipcMain.on(`${ipc.console.resize}${id}`, (evt, colsAndRows) => {
    if (!colsAndRows || !colsAndRows.cols || !colsAndRows.rows) return;
    const { cols, rows } = colsAndRows;
    ptyProcess.resize(cols, rows);
  });
});

function killConsole(id) {
  if (!terminals[id]) return;
  electron.ipcMain.removeAllListeners(`${ipc.console.sendData}${id}`);
  electron.ipcMain.removeAllListeners(`${ipc.console.resize}${id}`);
  terminals[id].kill();
  delete terminals[id];
}

function killAllConsoles() {
  for (const id of Object.keys(terminals)) {
    killConsole(id);
  }
}

electron.ipcMain.on(ipc.console.killAllConsoles, (evt, data) => {
  killAllConsoles();
});

electron.ipcMain.on(ipc.console.killConsole, (evt, id) => {
  killConsole(id);
});

electron.ipcMain.on(ipc.openExternalLink, (evt, link) => {
  if (!validator.isURL(link, { require_protocol: true, validate_length: true }))
    return;
  electron.shell.openExternal(link);
});

electron.ipcMain.on(ipc.openFileDialogOptions.selectFolder, async (evt, id) => {
  mainWindow.webContents.send(
    `${ipc.openFileDialogOptions.selectFolder}${id}`,
    (
      await electron.dialog.showOpenDialog({
        properties: ['openDirectory'],
      })
    ).filePaths[0]
  );
});

electron.ipcMain.on(ipc.openFileDialogOptions.selectTgz, async (evt, id) => {
  mainWindow.webContents.send(
    `${ipc.openFileDialogOptions.selectTgz}${id}`,
    (
      await electron.dialog.showOpenDialog({
        filters: [{ name: 'Learn Projects', extensions: ['tgz'] }],
        properties: ['openFile'],
      })
    ).filePaths[0]
  );
});

electron.ipcMain.on(ipc.openFileDialogOptions.selectLap, async (evt, id) => {
  mainWindow.webContents.send(
    `${ipc.openFileDialogOptions.selectLap}${id}`,
    (
      await electron.dialog.showOpenDialog({
        filters: [{ name: 'Learn Pages', extensions: ['lap'] }],
        properties: ['openFile'],
      })
    ).filePaths[0]
  );
});

electron.ipcMain.on(ipc.titlebar.close, () => {
  mainWindow.close();
});
electron.ipcMain.on(ipc.titlebar.maximizeRestore, () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
electron.ipcMain.on(ipc.titlebar.minimize, () => {
  mainWindow.minimize();
});

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
app.whenReady().then(async () => {
  await installDevToolExtensions();
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    show: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      worldSafeExecuteJavaScript: true,
      devTools: inDevelopment,
      nodeIntegration: true,
      nodeIntegrationWorker: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/../dist/index.html`);
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('did-start-loading', (evt, data) => {
    installDevToolExtensions();
  });
});

app.on('window-all-closed', function () {
  killAllConsoles();
  app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
