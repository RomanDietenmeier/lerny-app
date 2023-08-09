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
        ) => Promise<string | undefined>;
        loadFile: (
          learnProject: string,
          filename: string,
          folderStructure?: Array<string>
        ) => Promise<string>;
        deleteFile: (learnProject: string, file: string) => void;
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
        deleteLearnPage: (learnProject: string, learnPage: string) => void;
        saveLearnPage: (
          content: string,
          title?: string,
          learnProject?: string
        ) => Promise<[string, string]>;
        exportLearnPage: (
          learnProject: string,
          learnPage: string
        ) => Promise<void>;
        importLearnPage: (LearnProjects: string) => Promise<string | undefined>;
      };
      learnProject: {
        createProject: (project: string) => string | undefined;
        deleteProject: (project: string) => void;
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
      style: {
        setFontSize: (fontSize: number) => Promise<void>;
        getFontSize: () => Promise<number | null>;
      };
    };
    handleMarkdownAnchorClick: (href: string) => void;
    webComponent: {
      getContentOfHTMLCommentString(string: string): string;
    };
  }
}

export {};
