import { size } from 'constants/metrics';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import { store } from 'redux/store';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { CodeEditor } from 'web-components/code-editor/CodeEditor';
import { XTermTerminal } from 'web-components/terminal/XTermTerminal';

export const ExecutableCodeEditorComponentHtmlTag = 'executable-code-editor';

const enum Attributes {
  HeightCodeEditor = 'HeightCodeEditor',
  HeightTerminal = 'HeightTerminal',
}

class ExecutableCodeEditorComponent extends HTMLElement {
  private consoleId: number;
  private reactRenderNode: HTMLSpanElement | null = null;

  constructor() {
    super();
    this.consoleId = window.electron.console.createConsole();
  }

  connectedCallback() {
    if (!this.isConnected || this.reactRenderNode) {
      return;
    }
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const styleSlot = document.createElement('section');
    this.reactRenderNode = document.createElement('span');
    const styleElements = document.head.querySelectorAll('style');

    for (const element of styleElements) {
      const duplicateElement = element.cloneNode(true);
      shadowRoot.append(duplicateElement);
    }

    const codeEditorHeight =
      this.getAttribute(Attributes.HeightCodeEditor) ||
      size.default.codeEditorHeight;
    const terminalHeight =
      this.getAttribute(Attributes.HeightTerminal) ||
      size.default.terminalHeight;

    styleSlot.style.setProperty(
      'height',
      `calc(${codeEditorHeight} + ${terminalHeight})`
    );
    this.reactRenderNode.style.setProperty('height', '100%');

    shadowRoot.append(styleSlot);
    styleSlot.append(this.reactRenderNode);

    ReactDOM.render(
      <Provider store={store}>
        <StyleSheetManager target={styleSlot}>
          <ThemeProvider
            theme={selectCurrentTheme(store.getState()).styledComponentsTheme}
          >
            <div style={{ height: codeEditorHeight }}>
              <CodeEditor />
            </div>
            <div style={{ height: terminalHeight }}>
              <XTermTerminal
                consoleId={this.consoleId}
                height={terminalHeight}
              />
            </div>
          </ThemeProvider>
        </StyleSheetManager>
      </Provider>,
      this.reactRenderNode
    );
  }

  private getAttributeOrUndefined(attribute: string): string | undefined {
    return this.getAttribute(attribute) ?? undefined;
  }

  private getAttributeFolderStructure(): Array<string> | undefined {
    const folderStructure = this.getAttribute('folderStructure');
    if (!folderStructure) {
      return undefined;
    }
    return folderStructure.split('/');
  }

  disconnectedCallback() {
    if (!this.reactRenderNode) return;
    ReactDOM.unmountComponentAtNode(this.reactRenderNode);
  }
}

window.customElements.define(
  ExecutableCodeEditorComponentHtmlTag,
  ExecutableCodeEditorComponent
);
