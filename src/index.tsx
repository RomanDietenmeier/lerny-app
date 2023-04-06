import { loader } from '@monaco-editor/react';
import { App } from 'App';
import * as monaco from 'monaco-editor';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { store } from 'redux/store';
import 'web-components/code-editor/CodeEditorWebComponent';

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

window.handleMarkdownAnchorClick = (href: string) => {
  window.electron.openExternalLink(href);
};

window.webComponent = {
  getContentOfHTMLCommentString: (string) =>
    string.substring(4, string.length - 3).replaceAll('\n', '\r'),
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
