import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './components/Editor';
import * as monaco from 'monaco-editor';

import { loader } from '@monaco-editor/react';
import { XTermTerminal } from './components/Terminal';
import 'xterm/css/xterm.css';
import { initKeyboardCapture } from './globals/keyboardCapture';

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
    }
};




loader.config({ monaco });
initKeyboardCapture();

(async () => {
    await loader.init();
    ReactDOM.render(
        <React.StrictMode>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1e1e1e', color: '#fff' }}>
                <p style={{ margin: '0', padding: '1rem 0 0.25rem 1rem' }}>Write Code in here:</p>
                <Editor />
                <p style={{ margin: '0', padding: '1rem 0 0.25rem 1rem' }}>Use the Console here:</p>
                <XTermTerminal />
            </div>
        </React.StrictMode>,
        document.getElementById('root')
    );
})();


