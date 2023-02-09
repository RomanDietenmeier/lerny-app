const os = require('os');

//on this line == instead of === is required
const runningOnWindows = os.platform == 'win32';

const persistentLocalDataRootPath = runningOnWindows
  ? process.env.appdata
  : process.env.HOME;

const localPersistentDataPath = `${persistentLocalDataRootPath}/lerny-app`;
const localPersistentProjectsPath = `${localPersistentDataPath}/projects`;

const dumpLocalDataRootPath = runningOnWindows
  ? process.env.localappdata
  : `${process.env.HOME}/dump`;
const localDumpDataPath = `${dumpLocalDataRootPath}/lerny-app`;

const learnPageExtension = '.lap';
const textFileEncoding = 'utf-8';

module.exports = {
  dumpLocalDataRootPath,
  learnPageExtension,
  localDumpDataPath,
  localPersistentDataPath,
  localPersistentProjectsPath,
  persistentLocalDataRootPath,
  runningOnWindows,
  textFileEncoding,
};
