const electron = require('electron');
const path = require('path');
const os = require("os");
const node_pty = require("node-pty");

//on this line == instead of === is required
const shell = os.platform == "win32" ? "powershell.exe" : "bash";

if (process.env.NODE_ENV === 'development') {
    const path = require('path');
    require('electron-reload')(path.join(__dirname, '..', 'dist'));
}

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
const ptyProcesses = [];


app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            worldSafeExecuteJavaScript: true,
            devTools: true,
            nodeIntegration: true,
            nodeIntegrationWorker: true,
        }
    });
    mainWindow.loadURL(`file://${__dirname}/../dist/index.html`);
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.webContents.openDevTools();

    const ptyProcess = node_pty.spawn(shell, [], {
        name: "xterm-color",
        cwd: process.env.HOME,
        env: process.env
    })
    ptyProcess.onData((data) => {
        mainWindow.webContents.send("terminal.incomingData", data);
        process.stdout.write(data);
    });

    electron.ipcMain.on("terminal.toTerminal", (evt, data) => {
        ptyProcess.write(data);
    });

    ptyProcesses.push(ptyProcess);
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
