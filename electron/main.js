const electron = require('electron');
const path = require('path');
const os = require('os');
const node_pty = require('node-pty');

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

//on this line == instead of === is required
const runningOnWindows = os.platform == 'win32';
const shell = runningOnWindows ? 'powershell.exe' : 'bash';

const terminals = {};

electron.ipcMain.on('console.createConsole', (evt, id) => {
  const ptyProcess = node_pty.spawn(shell, [], {
    name: 'xterm-color',
    cwd: runningOnWindows ? process.env.USERPROFILE : process.env.HOME,
    env: process.env,
  });
  terminals[id] = ptyProcess;

  const dispose = ptyProcess.onData((data) => {
    if (!terminals[id]) {
      dispose.dispose();
      return;
    }
    mainWindow.webContents.send(`console.incomingData.${id}`, data);
  });

  electron.ipcMain.on(`console.toTerminal.${id}`, (evt, data) => {
    ptyProcess.write(data);
  });

  electron.ipcMain.on(`console.resize.${id}`, (evt, { cols, rows }) => {
    ptyProcess.resize(cols, rows);
  });
});

function killConsole(id) {
  if (!terminals[id]) return;
  electron.ipcMain.removeAllListeners(`console.toTerminal.${id}`);
  electron.ipcMain.removeAllListeners(`console.resize.${id}`);
  terminals[id].kill();
  delete terminals[id];
}

function killAllConsoles() {
  for (const id of Object.keys(terminals)) {
    killConsole(id);
  }
}

electron.ipcMain.on('console.killAllConsoles', (evt, data) => {
  killAllConsoles();
});

electron.ipcMain.on('console.killConsole', (evt, id) => {
  killConsole(id);
});

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
app.whenReady().then(async () => {
  await installDevToolExtensions();
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    show: false,
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
    killAllConsoles();
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
