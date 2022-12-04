const path = require('path');
const electron = require('electron');

require('electron-reload')(path.join(__dirname, '..', 'dist'), {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
});

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: { worldSafeExecuteJavaScript: true, devTools: true }
    });
    mainWindow.loadURL(`file://${__dirname}/../dist/index.html`);
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
