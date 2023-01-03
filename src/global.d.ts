import { LearnProjects } from './redux/slices/learnProjectsSlice';

declare global {
  interface Window {
    electron: {
      console: {
        createConsole: () => number;
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
      getLocalLearnProjectAndLearnPages: () => LearnProjects;
      learnPage: {
        load: (learnProject: string, learnPage: string) => string;
        save: (content: string, title?: string, learnProject?: string) => [string,string];
      };
      openExternalLink: (link: string) => void;
    };
    keyPressMap: { [key: string]: undefined | boolean };
    handleMarkdownAnchorClick: (href: string) => void;
  }
}

export {};
