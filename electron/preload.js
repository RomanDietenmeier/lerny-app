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
  async saveLearnPage(content, title, learnProject) {
    try {
      await fs.promises.mkdir(
        `${
          runningOnWindows ? process.env.appdata : process.env.HOME
        }/lerny-app/projects`
      );
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error('error1', err);
      }
    }
    try {
      await fs.promises.mkdir(
        `${
          runningOnWindows ? process.env.appdata : process.env.HOME
        }/lerny-app/projects/${learnProject}`
      );
    } catch (err) {
      if (err.code != 'EEXIST') {
        console.error('error2', err);
      }
    }

    fs.writeFile(
      `${
        runningOnWindows ? process.env.appdata : process.env.HOME
      }/lerny-app/projects/${learnProject}/${title}.lap`,
      content,
      (err) => {
        if (!err) return;
        console.error(err);
      }
    );
  },
});
