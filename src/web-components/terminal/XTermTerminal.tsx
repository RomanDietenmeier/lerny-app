import { size } from 'constants/metrics';
import * as _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon, ITerminalDimensions } from 'xterm-addon-fit';

export type XTermTerminalProps = {
  consoleId: number;
  disableStdin?: boolean;
  folderPath?: string;
  height?: string;
  initialInput?: string;
};

export function XTermTerminal({
  consoleId,
  disableStdin,
  height = size.default.terminalHeight,
  initialInput,
}: XTermTerminalProps): JSX.Element {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) return;
    const terminal = new Terminal({ disableStdin });
    terminal.open(terminalRef.current);

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    fitAddon.activate(terminal);
    fitAddon.fit();

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

    if (initialInput) {
      window.electron.console.sendToTerminal(consoleId, initialInput);
    }

    return () => {
      window.removeEventListener('resize', resizeTerminalDebounces);
      window.electron.console.killConsole(consoleId);
    };
  }, [terminalRef]);
  return <div style={{ height }} ref={terminalRef} />;
}
