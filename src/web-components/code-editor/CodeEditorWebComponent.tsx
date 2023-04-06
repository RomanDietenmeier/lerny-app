import { size } from 'constants/metrics';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import { store } from 'redux/store';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { CodeEditor } from 'web-components/code-editor/CodeEditor';

export const CodeEditorWebComponentHtmlTag = 'code-editor';

const enum Attributes {
  Filename = 'Filename',
  FolderStructure = 'FolderStructure',
  Height = 'Height',
  Language = 'Language',
  LearnProject = 'LearnProject',
}

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
      this.getAttribute(Attributes.Height) ?? size.default.codeEditorHeight
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
            <CodeEditor
              filename={this.getAttributeOrUndefined(Attributes.Filename)}
              folderStructure={this.getAttributeFolderStructure()}
              initialCodeEditorValue={window.webComponent.getContentOfHTMLCommentString(
                this.innerHTML
              )}
              learnProject={this.getAttributeOrUndefined(
                Attributes.LearnProject
              )}
              monacoEditorProps={{
                language: this.getAttributeOrUndefined(Attributes.Language),
              }}
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

  private getAttributeOrUndefined(attribute: string): string | undefined {
    return this.getAttribute(attribute) ?? undefined;
  }

  private getAttributeFolderStructure(): Array<string> | undefined {
    const folderStructure = this.getAttribute(Attributes.FolderStructure);
    if (!folderStructure) {
      return undefined;
    }
    return folderStructure.split('/');
  }
}

window.customElements.define(
  CodeEditorWebComponentHtmlTag,
  CodeEditorWebComponent
);
