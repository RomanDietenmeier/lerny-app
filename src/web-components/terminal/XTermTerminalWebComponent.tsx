import { sizeRem } from 'constants/metrics';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import { setMainTerminal } from 'redux/slices/mainTerminalSlice';
import { store } from 'redux/store';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { XTermTerminal } from 'web-components/terminal/XTermTerminal';

export const XTermTerminalWebComponentHtmlTag = 'xterm-terminal';

const enum Attributes {
  DisableStdin = 'DisableStdin',
  FolderStructure = 'FolderStructure',
  Height = 'Height',
}

export class XTermTerminalWebComponent extends HTMLElement {
  private consoleId: number;
  private reactRenderNode: HTMLSpanElement | null = null;

  constructor() {
    super();

    this.consoleId = window.electron.console.createConsole(
      `${store.getState().activeLearnPage.learnProject || '.'}/${
        this.getAttribute(Attributes.FolderStructure) || '.'
      }`
    );
    store.dispatch(setMainTerminal({ id: this.consoleId }));
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const styleSlot = document.createElement('section');
    this.reactRenderNode = document.createElement('span');
    const styleElements = document.head.querySelectorAll('style');

    for (const element of styleElements) {
      const duplicateElement = element.cloneNode(true);
      shadowRoot.append(duplicateElement);
    }

    styleSlot.style.setProperty('height', this.getAttribute(Attributes.Height));

    shadowRoot.append(styleSlot);
    styleSlot.append(this.reactRenderNode);

    ReactDOM.render(
      <Provider store={store}>
        <StyleSheetManager target={styleSlot}>
          <ThemeProvider
            theme={selectCurrentTheme(store.getState()).styledComponentsTheme}
          >
            <XTermTerminal
              consoleId={this.consoleId}
              disableStdin={this.getDisableStdin()}
              height={sizeRem.terminal.height}
              initialInput={window.webComponent.getContentOfHTMLCommentString(
                this.innerHTML
              )}
            />
          </ThemeProvider>
        </StyleSheetManager>
      </Provider>,
      this.reactRenderNode
    );
  }

  disconnectedCallback() {
    if (!this.reactRenderNode) return;
    ReactDOM.unmountComponentAtNode(this.reactRenderNode);
  }

  private getDisableStdin() {
    return this.getAttribute(Attributes.DisableStdin) !== null;
  }

  private getAttributeOrUndefined(attribute: string): string | undefined {
    return this.getAttribute(attribute) ?? undefined;
  }
}

window.customElements.define(
  XTermTerminalWebComponentHtmlTag,
  XTermTerminalWebComponent
);
