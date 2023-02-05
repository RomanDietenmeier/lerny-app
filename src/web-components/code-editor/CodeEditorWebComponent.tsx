import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { selectCurrentTheme } from '../../redux/selectors/themeSelectors';
import { store } from '../../redux/store';
import { CodeEditor, CodeEditorProps } from './CodeEditor';
import { StyleSheetManager } from 'styled-components';
import { editor } from 'monaco-editor';
import { EditorProps } from '@monaco-editor/react';

type Methods = {
  filename?: (filename: string) => void;
  folderStructure?: (folderStructure: Array<string>) => void;
  learnProject?: (learnProject: string) => void;
  monacoEditorProps?: (monacoEditorProps: EditorProps) => void;
  setEditor?: (
    setEditor: (editor: editor.IStandaloneCodeEditor) => void
  ) => void;
};

type MethodValues = {
  filename?: string;
  folderStructure?: Array<string>;
  learnProject?: string;
  monacoEditorProps?: EditorProps;
  setEditor?: (editor: editor.IStandaloneCodeEditor) => void;
};

export const CodeEditorWebComponentHTMLTag = 'code-editor';

const CALL_METHOD_TIMEOUT = 1000;

class CodeEditorWebComponent extends HTMLElement {
  private methodsSetup = false;
  private methods: Methods = {};

  private async callMethod<T extends keyof Methods>(
    method: T,
    value: MethodValues[T]
  ) {
    if (!this.methodsSetup) {
      return setTimeout(() => {
        this.callMethod(method, value);
      }, CALL_METHOD_TIMEOUT);
    }
    if (!this.methods[method]) return;

    if (typeof this.methods[method] === 'function') {
      //@ts-expect-error function is not undefined!
      this.methods[method](() => value);
      return;
    }
    //@ts-expect-error function is not undefined
    this.methods[method](value);
  }

  constructor() {
    super();
  }

  CodeEditor = (props: Partial<CodeEditorProps>) => {
    const [filename, setFilename] = useState(props.filename);
    const [folderStructure, setFolderStructure] = useState(
      props.folderStructure
    );
    const [learnProject, setLearnProject] = useState(props.learnProject);
    const [monacoEditorProps, setMonacoEditorProps] = useState(
      props.monacoEditorProps
    );
    const [setEditor, setSetEditor] = useState(() => props.setEditor);

    useEffect(() => {
      this.methods['filename'] = setFilename;
      this.methods['folderStructure'] = setFolderStructure;
      this.methods['learnProject'] = setLearnProject;
      this.methods['monacoEditorProps'] = setMonacoEditorProps;
      this.methods['setEditor'] = setSetEditor;

      this.methodsSetup = true;
    }, []);
    return (
      <CodeEditor
        filename={filename}
        folderStructure={folderStructure}
        learnProject={learnProject}
        setEditor={setEditor}
        monacoEditorProps={monacoEditorProps}
      />
    );
  };

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
            <this.CodeEditor
              filename={this.getAttributeOrUndefined('filename')}
              folderStructure={this.getAttributeFolderStructure()}
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
    return super.getAttribute(attribute) ?? undefined;
  }

  private getAttributeFolderStructure(): Array<string> | undefined {
    const folderStructure = super.getAttribute('folderStructure');
    if (!folderStructure) {
      return undefined;
    }
    return folderStructure.split('/');
  }

  public setFilename(filename?: string) {
    this.callMethod('filename', filename);
  }
  public setFolderStructure(folderStructure?: Array<string>) {
    this.callMethod('folderStructure', folderStructure);
  }
  public setLearnProject(learnProject?: string) {
    this.callMethod('learnProject', learnProject);
  }
  public setMonacoEditorProps(monacoEditorProps?: EditorProps) {
    this.callMethod('monacoEditorProps', monacoEditorProps);
  }
  public setSetEditor(
    setEditor?: (editor: editor.IStandaloneCodeEditor) => void
  ) {
    this.callMethod('setEditor', setEditor);
  }
}

window.customElements.define(
  CodeEditorWebComponentHTMLTag,
  CodeEditorWebComponent
);
