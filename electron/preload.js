const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');
const fs = require('fs');

//on this line == instead of === is required
const runningOnWindows = os.platform == 'win32';
const localDataRootPath = runningOnWindows
  ? process.env.appdata
  : process.env.HOME;
const localDataPath = `${localDataRootPath}/lerny-app`;
const localProjectsPath = `${localDataPath}/projects`;
const learnPageExtension = '.lap';

let uniqueId = new Date().getTime();
function getUniqueId() {
  return uniqueId++;
}

async function createDirs(paths) {
  for (const path of paths) {
    try {
      await fs.promises.mkdir(path);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error('Could not create Directory:', err);
        return false;
      }
    }
  }
  return true;
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
  async getLocalLearnProjectAndLearnPages() {
    const ret = {};
    const projects = await fs.promises.readdir(localProjectsPath);
    for (const project of projects) {
      try {
        const pages = await fs.promises.readdir(
          `${localProjectsPath}/${project}`
        );
        ret[project] = pages;
      } catch (err) {
        if (err.code !== 'ENOTDIR') {
          console.error(err);
        }
      }
    }
    return ret;
  },
  learnPage: {
    async load(learnProject, learnPage) {
      return await fs.promises.readFile(
        `${localProjectsPath}/${learnProject}/${learnPage}`,
        { encoding: 'utf-8' }
      );
    },
    async save(content, learnPage, learnProject) {
      if (!learnProject) {
        learnProject = 'untitled';
      }
      if (
        !(await createDirs([
          localDataPath,
          localProjectsPath,
          `${localProjectsPath}/${learnProject}`,
        ]))
      ) {
        return;
      }
      if (!learnPage) {
        const filesInDir = await fs.promises.readdir(
          `${localProjectsPath}/${learnProject}`
        );

        let count = 0;
        while (
          filesInDir.includes(`untitled${++count}${learnPageExtension}`)
        ) {}
        learnPage = `untitled${count}`;
      } else if (
        learnPage.substring(learnPage.length - learnPageExtension.length) ===
        learnPageExtension
      ) {
        learnPage = learnPage.substring(
          0,
          learnPage.length - learnPageExtension.length
        );
      }
      await fs.promises.writeFile(
        `${localProjectsPath}/${learnProject}/${learnPage}${learnPageExtension}`,
        content,
        'utf-8'
      );
      return [learnPage, learnProject];
    },
  },
  openExternalLink(link) {
    ipcRenderer.send('openExternalLink', link);
  },
});
