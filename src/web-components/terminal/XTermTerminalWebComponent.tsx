import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { selectCurrentTheme } from '../../redux/selectors/themeSelectors';
import { store } from '../../redux/store';
import { StyleSheetManager } from 'styled-components';
import { XTermTerminal } from './XTermTerminal';

export const XTermTerminalWebComponentHTMLTag = 'xterm-terminal';

export class XTermTerminalWebComponent extends HTMLElement {
  private consoleId: number;

  constructor() {
    super();
    this.consoleId = window.electron.console.createConsole(
      this.getAttributeOrUndefined('folderPath')
    );
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const styleSlot = document.createElement('section');
    const mountPoint = document.createElement('span');
    const styleElements = document.head.querySelectorAll('style');

    for (const element of styleElements) {
      const duplicateElement = element.cloneNode(true);
      shadowRoot.append(duplicateElement);
    }

    styleSlot.style.setProperty('height', this.getAttribute('height'));

    shadowRoot.append(styleSlot);
    styleSlot.append(mountPoint);

    ReactDOM.render(
      <Provider store={store}>
        <StyleSheetManager target={styleSlot}>
          <ThemeProvider
            theme={selectCurrentTheme(store.getState()).styledComponentsTheme}
          >
            <XTermTerminal
              consoleId={this.consoleId}
              disableStdin={this.getDisableStdin()}
              height={this.getAttributeOrUndefined('height')}
              initialInput={window.webComponent.getContentOfHTMLCommentString(
                this.innerHTML
              )}
            />
          </ThemeProvider>
        </StyleSheetManager>
      </Provider>,
      mountPoint
    );
  }

  private getDisableStdin() {
    return this.getAttribute('disableStdin') !== null;
  }

  private getAttributeOrUndefined(attribute: string): string | undefined {
    return this.getAttribute(attribute) ?? undefined;
  }

  public sendInputToTerminal(input: string) {
    window.electron.console.sendToTerminal(this.consoleId, input + '\r');
  }
}

window.customElements.define(
  XTermTerminalWebComponentHTMLTag,
  XTermTerminalWebComponent
);
