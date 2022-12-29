const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');
const fs = require('fs');

//on this line == instead of === is required
const runningOnWindows = os.platform == 'win32';

let uniqueId = new Date().getTime();
function getUniqueId() {
  return uniqueId++;
}

contextBridge.exposeInMainWorld('electron', {
  console: {
    createConsole() {
      const id = getUniqueId();
      ipcRenderer.send('console.createConsole', id);
      return id;
    },
    onIncomingData(id, listener) {
      ipcRenderer.on(`console.incomingData.${id}`, listener);
    },
    sendToTerminal(id, data) {
      ipcRenderer.send(`console.toTerminal.${id}`, data);
    },
    resizeTerminal(id, data) {
      ipcRenderer.send(`console.resize.${id}`, data);
    },
    killAllConsoles() {
      ipcRenderer.send('console.killAllConsoles');
    },
    killConsole(id) {
      ipcRenderer.send('console.killConsole', id);
    },
  },
  openExternalLink(link) {
    ipcRenderer.send('openExternalLink', link);
  },
  saveTextFile(text, filenameAndPath) {
    fs.writeFile(
      `${
        runningOnWindows ? process.env.USERPROFILE : process.env.HOME
      }/${filenameAndPath}`,
      text,
      (err) => {
        if (!err) return;
        console.error(err);
      }
    );
  },
});
