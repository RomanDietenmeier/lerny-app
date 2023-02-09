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
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const styleSlot = document.createElement('section');
    const mountPoint = document.createElement('span');
    const styleElements = document.head.querySelectorAll('style');

    for (const element of styleElements) {
      const duplicateElement = element.cloneNode(true);
      shadowRoot.append(duplicateElement);
    }

    styleSlot.style.setProperty(
      'height',
      this.getAttribute('height') ?? '4rem'
    );
    mountPoint.style.setProperty('height', '100%');

    shadowRoot.append(styleSlot);
    styleSlot.append(mountPoint);

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
      mountPoint
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
}

window.customElements.define(
  CodeEditorWebComponentHTMLTag,
  CodeEditorWebComponent
);
