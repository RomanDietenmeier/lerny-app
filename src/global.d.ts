declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                send: (channel: string, ...args: any[]) => void;
                on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
            }
            saveTextFile: (text: string | NodeJS.ArrayBufferView, filenameAndPath: fs.PathOrFileDescriptor) => void;
        },
        keyPressMap: { [key: string]: undefined | boolean };

    }
}

export { };