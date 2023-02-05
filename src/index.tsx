import React from 'react';
import ReactDOM from 'react-dom';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import './web-components/code-editor/CodeEditorWebComponent';
import { initKeyboardCapture } from './globals/keyboardCapture';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { App } from './App';
import { HashRouter } from 'react-router-dom';

self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: unknown, label: string) {
    if (label === 'json') {
      return './json.worker.bundle.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './css.worker.bundle.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.bundle.js';
    }
    return './editor.worker.bundle.js';
  },
};
localStorage.setItem('test', localStorage.getItem('test') + '_');

loader.config({ monaco });
initKeyboardCapture();

window.handleMarkdownAnchorClick = (href: string) => {
  window.electron.openExternalLink(href);
};

(async () => {
  await loader.init();
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
})();
