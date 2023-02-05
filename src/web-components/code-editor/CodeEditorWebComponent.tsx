import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { selectCurrentTheme } from '../../redux/selectors/themeSelectors';
import { store } from '../../redux/store';
import { CodeEditor } from './CodeEditor';
import { StyleSheetManager } from 'styled-components';

export const CodeEditorWebComponentHTMLTag = 'code-editor';

class CodeEditorWebComponent extends HTMLElement {
  constructor() {
    super();
  }

  CodeEditor = () => {
    return <CodeEditor />;
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

    styleSlot.style.setProperty('height', '100%');

    shadowRoot.append(styleSlot);
    styleSlot.append(mountPoint);

    ReactDOM.render(
      <Provider store={store}>
        <StyleSheetManager target={styleSlot}>
          <ThemeProvider
            theme={selectCurrentTheme(store.getState()).styledComponentsTheme}
          >
            <this.CodeEditor />
          </ThemeProvider>
        </StyleSheetManager>
      </Provider>,
      mountPoint
    );
  }
}

window.customElements.define(
  CodeEditorWebComponentHTMLTag,
  CodeEditorWebComponent
);
