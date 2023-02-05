import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon, ITerminalDimensions } from 'xterm-addon-fit';
import * as _ from 'lodash';

export function XTermTerminal(): JSX.Element {
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!terminalRef.current) return;
    const terminal = new Terminal({ disableStdin: false });
    terminal.open(terminalRef.current);

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    fitAddon.activate(terminal);
    fitAddon.fit();

    const consoleId = window.electron.console.createConsole();
    window.electron.console.onIncomingData(consoleId, (evt, data) => {
      terminal.write(data);
    });
    terminal.onData((data) =>
      window.electron.console.sendToTerminal(consoleId, data)
    );
    window.electron.console.resizeTerminal(
      consoleId,
      fitAddon.proposeDimensions() as ITerminalDimensions
    );

    const resizeTerminalDebounces = _.debounce(function resizeTerminal() {
      fitAddon.fit();
      window.electron.console.resizeTerminal(
        consoleId,
        fitAddon.proposeDimensions() as ITerminalDimensions
      );
    }, 500);
    window.addEventListener('resize', resizeTerminalDebounces);

    return () => {
      window.removeEventListener('resize', resizeTerminalDebounces);
      window.electron.console.killConsole(consoleId);
    };
  }, [terminalRef]);
  return <div ref={terminalRef} />;
}
