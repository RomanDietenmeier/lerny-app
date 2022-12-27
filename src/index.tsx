import React from 'react';
import ReactDOM from 'react-dom';
import * as monaco from 'monaco-editor';

import { loader } from '@monaco-editor/react';
import 'xterm/css/xterm.css';
import { initKeyboardCapture } from './globals/keyboardCapture';
import { StartPage } from './pages/StartPage';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './styles/defaultTheme';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';

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

(async () => {
  await loader.init();
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={defaultTheme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/create" element={<NavLink to="/">ROOT</NavLink>} />
            <Route
              path="*"
              element={
                <div style={{ color: '#fff' }}>
                  <div>ERROR</div>
                  <NavLink to="/">ROOT</NavLink>
                </div>
              }
            />
          </Routes>
        </HashRouter>

        {/* <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1e1e1e',
          color: '#fff',
        }}
      >
        <MarkdownViewer />
        <p style={{ margin: '0', padding: '1rem 0 0.25rem 1rem' }}>
          Write Code in here:
        </p>
        <Editor /> 
        <p style={{ margin: '0', padding: '1rem 0 0.25rem 1rem' }}>
          Use the Console here:
        </p>
        <XTermTerminal />
      </div> */}
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
})();
