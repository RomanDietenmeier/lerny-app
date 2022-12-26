const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

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
  saveTextFile(text, filenameAndPath) {
    fs.writeFile(`${process.env.HOME}/${filenameAndPath}`, text, (err) => {
      if (!err) return;
      console.error(err);
    });
  },
});
