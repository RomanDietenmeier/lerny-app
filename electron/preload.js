const { ipcRenderer, contextBridge } = require("electron");
const fs = require('fs');

contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
        send: (channel, ...args) => {
            ipcRenderer.send(channel, ...args);
        },
        on: (channel, listener) => {
            ipcRenderer.on(channel, listener);
        }
    },
    saveTextFile(text, filenameAndPath) {
        fs.writeFile(`${process.env.HOME}/${filenameAndPath}`, text, (err) => {
            if (!err) return;
            console.error(err);
        });
    }
});