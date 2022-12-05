const electron = require('electron');

if (process.env.NODE_ENV === 'development') {
    const path = require('path');
    require('electron-reload')(path.join(__dirname, '..', 'dist'));
}

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            devTools: true,
            nodeIntegration: true
        }
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
