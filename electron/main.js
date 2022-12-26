const electron = require('electron');
const path = require('path');
const os = require('os');
const node_pty = require('node-pty');

if (process.env.NODE_ENV === 'development') {
  const path = require('path');
  require('electron-reload')(path.join(__dirname, '..', 'dist'));
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

  ptyProcess.onData((data) => {
    if(!terminals[id])return;
    mainWindow.webContents.send(`console.incomingData.${id}`, data);
  });

  electron.ipcMain.on(`console.toTerminal.${id}`, (evt, data) => {
    ptyProcess.write(data);
  });

  electron.ipcMain.on(`console.resize.${id}`, (evt, { cols, rows }) => {
    ptyProcess.resize(cols, rows);
  });
});

function killAllConsoles() {
  for (const [id, terminal] of Object.entries(terminals)) {
    terminal.kill();
    delete terminals[id];
  }
}

electron.ipcMain.on('console.killAllConsoles', (evt, data) => {
  killAllConsoles();
});

electron.ipcMain.on('console.killConsole', (evt, id) => {
  if (!terminals[id]) return;
  terminals[id].kill();
  delete terminals[id];
});

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      worldSafeExecuteJavaScript: true,
      devTools: process.env.NODE_ENV === 'development',
      nodeIntegration: true,
      nodeIntegrationWorker: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/../dist/index.html`);
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('did-start-loading', (evt, data) => {
    killAllConsoles();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    killAllConsoles();
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
