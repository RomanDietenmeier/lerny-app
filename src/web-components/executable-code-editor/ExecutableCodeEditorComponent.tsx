import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { selectCurrentTheme } from 'redux/selectors/themeSelectors';
import { store } from 'redux/store';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { CodeEditor } from 'web-components/code-editor/CodeEditor';
import { xml2js } from 'xml-js';

export const ExecutableCodeEditorComponentHtmlTag = 'executable-code-editor';

const enum Attributes {
  FileName = 'FileName',
  FolderStructure = 'FolderStructure',
  Language = 'Language',
}

class ExecutableCodeEditorComponent extends HTMLElement {
  private consoleId: number | null = null;
  private reactRenderNode: HTMLSpanElement | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isConnected || this.reactRenderNode) {
      return;
    }
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const styleSlot = document.createElement('section');
    this.reactRenderNode = document.createElement('span');
    const styleElements = document.head.querySelectorAll('style');

    this.consoleId = store.getState().mainTerminal.id;

    for (const element of styleElements) {
      const duplicateElement = element.cloneNode(true);
      shadowRoot.append(duplicateElement);
    }

    this.reactRenderNode.style.setProperty('height', '100%');

    shadowRoot.append(styleSlot);
    styleSlot.append(this.reactRenderNode);

    const { buildCommand, runCommand, starterCode, testCommand } =
      retrieveXmlData(
        window.webComponent.getContentOfHTMLCommentString(this.innerHTML)
      );

    const handleOnClickRun = () => {
      if (buildCommand && runCommand && this.consoleId) {
        window.electron.console.sendToTerminal(this.consoleId, buildCommand);
        window.electron.console.sendToTerminal(this.consoleId, runCommand);
      }
    };
    const handleOnClickTest = () => {
      if (buildCommand && testCommand && this.consoleId) {
        window.electron.console.sendToTerminal(this.consoleId, buildCommand);
        window.electron.console.sendToTerminal(this.consoleId, testCommand);
      }
    };

    ReactDOM.render(
      <Provider store={store}>
        <StyleSheetManager target={styleSlot}>
          <ThemeProvider
            theme={selectCurrentTheme(store.getState()).styledComponentsTheme}
          >
            <CodeEditor
              filename={this.getAttributeOrUndefined(Attributes.FileName)}
              folderStructure={this.getAttributeFolderStructure()}
              learnProject={
                store.getState().activeLearnPage.learnProject || undefined
              }
              initialCodeEditorValue={starterCode}
              monacoEditorProps={{
                language: this.getAttributeOrUndefined(Attributes.Language),
              }}
              onClickRun={handleOnClickRun}
              onClickTest={handleOnClickTest}
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
  ExecutableCodeEditorComponentHtmlTag,
  ExecutableCodeEditorComponent
);

function retrieveXmlData(xmlString: string) {
  try {
    const xml = xml2js(xmlString, { compact: true }) as {
      xml?: {
        'build-command'?: { _text: string };
        'run-command'?: { _text: string };
        'starter-code'?: { _text: string };
        'test-command'?: { _text: string };
      };
    };
    if (!xml.xml) return {};
    return {
      buildCommand: xml.xml['build-command']?._text,
      runCommand: xml.xml['run-command']?._text,
      starterCode: xml.xml['starter-code']?._text,
      testCommand: xml.xml['test-command']?._text,
    };
  } catch (err) {
    console.error('XML Parse Error: ', err);
    return {};
  }
}
