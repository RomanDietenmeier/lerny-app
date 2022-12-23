import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';


export function XTermTerminal(): JSX.Element {
    const terminalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!terminalRef.current) return;
        const terminal = new Terminal({ disableStdin: false });
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        fitAddon.activate(terminal);
        terminal.open(terminalRef.current);
        window.electron.ipcRenderer.send('terminal.resize', fitAddon.proposeDimensions());
        fitAddon.fit();


        terminal.onData(data => { window.electron.ipcRenderer.send('terminal.toTerminal', data); });
        window.electron.ipcRenderer.on('terminal.incomingData', (evt, data) => {
            terminal.write(data);
        });
    }, [terminalRef]);
    return <div ref={terminalRef} />;
}