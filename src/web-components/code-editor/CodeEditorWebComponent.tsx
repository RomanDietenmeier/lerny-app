import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { selectCurrentTheme } from '../../redux/selectors/themeSelectors';
import { store } from '../../redux/store';
import { CodeEditor, CodeEditorTerminalProps } from './CodeEditor';
import { StyleSheetManager } from 'styled-components';

export const CodeEditorWebComponentHTMLTag = 'code-editor';

class CodeEditorWebComponent extends HTMLElement {
  private reactRenderNode: HTMLSpanElement | null = null;

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

    styleSlot.style.setProperty(
      'height',
      this.getAttribute('height') ?? '4rem'
    );
    this.reactRenderNode.style.setProperty('height', '100%');

    shadowRoot.append(styleSlot);
    styleSlot.append(this.reactRenderNode);

    const terminal: CodeEditorTerminalProps = {
      runCommand: this.getAttributeOrUndefined('runCommand'),
      terminalHtmlId: this.getAttributeOrUndefined('terminalHtmlId'),
      testCommand: this.getAttributeOrUndefined('testCommand'),
    };

    ReactDOM.render(
      <Provider store={store}>
        <StyleSheetManager target={styleSlot}>
          <ThemeProvider
            theme={selectCurrentTheme(store.getState()).styledComponentsTheme}
          >
            <CodeEditor
              terminal={terminal}
              filename={this.getAttributeOrUndefined('filename')}
              folderStructure={this.getAttributeFolderStructure()}
              initialCodeEditorValue={window.webComponent.getContentOfHTMLCommentString(
                this.innerHTML
              )}
              learnProject={this.getAttributeOrUndefined('learnProject')}
              monacoEditorProps={{
                language: this.getAttributeOrUndefined('language'),
              }}
            />
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
  CodeEditorWebComponentHTMLTag,
  CodeEditorWebComponent
);
