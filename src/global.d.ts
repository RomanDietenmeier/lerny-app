declare global {
    interface Window {
        electron: {
            console: {
                createConsole: () => number;
                onIncomingData: (id: number, listener: (event: Electron.IpcRendererEvent, data: string) => void) => void;
                sendToTerminal: (id: number, data: string) => void,
                resizeTerminal: (id: number, data: { cols: number, rows: number }) => void,
                killAllConsoles: () => void;
                killConsole: (id: number) => void;
            },
            saveTextFile: (text: string | NodeJS.ArrayBufferView, filenameAndPath: fs.PathOrFileDescriptor) => void;
        },
        keyPressMap: { [key: string]: undefined | boolean };

    }
}

export { };