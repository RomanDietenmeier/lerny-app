import { LearnProjects } from 'redux/slices/learnProjectsSlice';

declare global {
  interface Window {
    electron: {
      console: {
        createConsole: (folderPath?: string) => number;
        onIncomingData: (
          id: number,
          listener: (event: Electron.IpcRendererEvent, data: string) => void
        ) => void;
        sendToTerminal: (id: number, data: string) => void;
        resizeTerminal: (
          id: number,
          data: { cols: number; rows: number }
        ) => void;
        killAllConsoles: () => void;
        killConsole: (id: number) => void;
      };
      titlebar: {
        closeApp: () => void;
        maximizeRestoreApp: () => void;
        minimizeApp: () => void;
      };
      getLocalLearnProjectAndLearnPages: () => LearnProjects;
      learnPage: {
        loadLearnPage: (
          learnProject: string,
          learnPage: string
        ) => Promise<string>;
        loadFile: (
          learnProject: string,
          filename: string,
          folderStructure?: Array<string>
        ) => Promise<string>;
        saveFile: (
          content: string,
          learnProject: string,
          filename: string,
          folderStructure?: Array<string>
        ) => void;
        renameLearnPage: (
          learnProject: string,
          filename: string,
          newFilename: string
        ) => string;
        saveLearnPage: (
          content: string,
          title?: string,
          learnProject?: string
        ) => Promise<[string, string]>;
      };
      learnProject: {
        exportProject: (project: string) => Promise<void>;
        importProject: () => Promise<void>;
        readWorkingDirectory: (folderPath: string) => Array<string>;
        onWorkingDirectoryChanged: (
          folderPath: string,
          listener: () => void
        ) => void;
        readProjectDirectory: (folderPath: string) => Array<string>;
        onProjectDirectoryChanged: (
          folderPath: string,
          listener: () => void
        ) => void;
      };
      openExternalLink: (link: string) => void;
    };
    handleMarkdownAnchorClick: (href: string) => void;
    webComponent: {
      getContentOfHTMLCommentString(string: string): string;
    };
  }
}

export {};
