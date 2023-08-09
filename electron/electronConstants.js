const os = require('os');

//on this line == instead of === is required
const runningOnWindows = os.platform == 'win32';

const persistentLocalDataRootPath = runningOnWindows
  ? process.env.appdata
  : process.env.HOME;

const localPersistentDataPath = `${persistentLocalDataRootPath}/lerny-app`;
const localPersistentProjectsPath = `${localPersistentDataPath}/projects`;
const localPersistentSettingsPath = `${localPersistentDataPath}/settings`;

const dumpLocalDataRootPath = runningOnWindows
  ? process.env.localappdata
  : `${process.env.HOME}/dump`;
const localDumpDataPath = `${dumpLocalDataRootPath}/lerny-app`;

const learnPageExtension = '.lap';
const textFileEncoding = 'utf-8';

const ipc = {
  console: {
    create: 'console.createConsole',
    incomingData: 'console.incomingData.',
    sendData: 'console.toTerminal.',
    resize: 'console.resize.',
    killAllConsoles: 'console.killAllConsoles',
    killConsole: 'console.killConsole',
  },
  openExternalLink: 'openExternalLink',
  openFileDialogOptions: {
    selectTgz: 'fileDialog.selectTgz',
    selectLap: 'fileDialog.selectLap',
    selectFolder: 'fileDialog.selectFolder',
  },
  titlebar: {
    close: 'closeApp',
    maximizeRestore: 'maximizeRestoreApp',
    minimize: 'minimizeApp',
  },
};

module.exports = {
  dumpLocalDataRootPath,
  learnPageExtension,
  localDumpDataPath,
  localPersistentDataPath,
  localPersistentProjectsPath,
  localPersistentSettingsPath,
  persistentLocalDataRootPath,
  runningOnWindows,
  textFileEncoding,
  ipc,
};
