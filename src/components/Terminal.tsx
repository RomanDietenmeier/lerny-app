import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';

export function XTermTerminal(): JSX.Element {
    const terminalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!terminalRef.current) return;
        const terminal = new Terminal({ disableStdin: false });
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current);
        fitAddon.fit();

        //<TESTING THE TERMINAL>
        terminal.write("Hello, World!");
        terminal.onData(data => { terminal.write(data); })
        //</TESTING THE TERMINAL>
    }, [terminalRef]);
    return <div ref={terminalRef} />
}