const { contextBridge, ipcRenderer, dialog } = require('electron');
const tar = require('tar');

const fs = require('fs');

const {
  dumpLocalDataRootPath,
  learnPageExtension,
  localDumpDataPath,
  localPersistentDataPath,
  localPersistentProjectsPath,
  textFileEncoding,
  ipc,
} = require('./electronConstants');

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
        continue;
      }
    }
  }
  return true;
}

contextBridge.exposeInMainWorld('electron', {
  console: {
    createConsole(folderPath) {
      const id = getUniqueId();
      ipcRenderer.send(ipc.console.create, id, folderPath);
      return id;
    },
    onIncomingData(id, listener) {
      ipcRenderer.on(`${ipc.console.incomingData}${id}`, listener);
    },
    sendToTerminal(id, data) {
      ipcRenderer.send(`${ipc.console.sendData}${id}`, data);
    },
    resizeTerminal(id, data) {
      ipcRenderer.send(`${ipc.console.resize}${id}`, data);
    },
    killAllConsoles() {
      ipcRenderer.send(ipc.console.killAllConsoles);
    },
    killConsole(id) {
      ipcRenderer.send(ipc.console.killConsole, id);
    },
  },
  titlebar: {
    closeApp() {
      ipcRenderer.send(ipc.titlebar.close);
    },
    maximizeRestoreApp() {
      ipcRenderer.send(ipc.titlebar.maximizeRestore);
    },
    minimizeApp() {
      ipcRenderer.send(ipc.titlebar.minimize);
    },
  },
  async getLocalLearnProjectAndLearnPages() {
    const ret = {};
    const projects = [];
    try {
      projects.push.apply(
        projects,
        await fs.promises.readdir(localPersistentProjectsPath)
      );
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(err);
      }
    }

    for (const project of projects) {
      try {
        const pages = await fs.promises.readdir(
          `${localPersistentProjectsPath}/${project}`
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
    async loadLearnPage(learnProject, learnPage) {
      return await fs.promises.readFile(
        `${localPersistentProjectsPath}/${learnProject}/${learnPage}`,
        { encoding: textFileEncoding }
      );
    },
    async loadFile(learnProject, filename, folderStructure = []) {
      let dir = `${localDumpDataPath}/${learnProject}/`;
      for (const folder of folderStructure) {
        dir += `${folder}/`;
      }
      const filePath = `${dir}/${filename}`;
      try {
        return await fs.promises.readFile(filePath, {
          encoding: textFileEncoding,
        });
      } catch (err) {
        if (err && err.code === 'ENOENT') {
          console.warn(`${`${dir}/${filename}`} does not exist`);
          return undefined;
        }
        console.error(err);
      }
    },
    async saveFile(content, learnProject, filename, folderStructure = []) {
      if (!content || !learnProject || !filename) {
        return;
      }
      let dir = `${localDumpDataPath}/${learnProject}`;
      const dirsToCreate = [];
      for (const folder of folderStructure) {
        dir = `${dir}/${folder}`;
        dirsToCreate.push(dir);
      }
      if (
        !(await createDirs([
          dumpLocalDataRootPath,
          localDumpDataPath,
          `${localDumpDataPath}/${learnProject}`,
          ...dirsToCreate,
        ]))
      ) {
        return;
      }
      await fs.promises.writeFile(
        `${dir}/${filename}`,
        content,
        textFileEncoding
      );
    },
    async saveLearnPage(content, learnPage, learnProject) {
      if (!learnProject) {
        learnProject = 'untitled';
      }
      if (
        !(await createDirs([
          localPersistentDataPath,
          localPersistentProjectsPath,
          `${localPersistentProjectsPath}/${learnProject}`,
        ]))
      ) {
        return;
      }
      if (!learnPage) {
        const filesInDir = await fs.promises.readdir(
          `${localPersistentProjectsPath}/${learnProject}`
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
        `${localPersistentProjectsPath}/${learnProject}/${learnPage}${learnPageExtension}`,
        content,
        textFileEncoding
      );
      return [learnPage, learnProject];
    },
  },
  learnProject: {
    async exportProject(project) {
      const targetDirectory = await openFileDialog(
        OpenFileDialogOption.selectFolder
      );
      if (!targetDirectory) return;

      try {
        await tar.c(
          {
            cwd: localPersistentProjectsPath,
            gzip: true,
            file: `${targetDirectory}/${project}.tgz`,
          },
          [project]
        );
      } catch (err) {
        console.error('export error', err, project);
      }
    },
    async importProject() {
      const srcDirectory = await openFileDialog(
        OpenFileDialogOption.selectFile
      );
      if (!srcDirectory) return;
      try {
        await tar.x({
          cwd: localPersistentProjectsPath,
          file: srcDirectory,
        });
      } catch (err) {
        console.error('import error', err);
      }
    },
    readDirectory(folderPath) {
      const fullFolderPath = `${localDumpDataPath}/${folderPath || ''}`;

      const files = fs.readdirSync(fullFolderPath)
      return files;
    },
    onDirectoryChanged(folderPath, listener) {
      const fullFolderPath = `${localDumpDataPath}/${folderPath || ''}`;
       fs.watch(fullFolderPath, () => {
        listener();
      })
    },
  },
  openExternalLink(link) {
    ipcRenderer.send('openExternalLink', link);
  },
});

const OpenFileDialogOption = {
  selectFolder: ipc.openFileDialogOptions.selectFolder,
  selectFile: ipc.openFileDialogOptions.selectFile,
};
async function openFileDialog(option) {
  const id = getUniqueId();
  const promise = new Promise((resolve) => {
    ipcRenderer.once(`${option}${id}`, (evt, path) => {
      resolve(path);
    });
  });
  ipcRenderer.send(option, id);
  return await promise;
}
