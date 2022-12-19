'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './components/Editor';
import * as monaco from 'monaco-editor';

import { loader } from '@monaco-editor/react';
import { XTermTerminal } from './components/Terminal';
import 'xterm/css/xterm.css';
import { initKeyboardCapture } from './globals/keyboardCapture';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import * as editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import * as jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import * as cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import * as htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import * as tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: unknown, label: string) {
        if (label === 'json') {
            return jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return tsWorker();
        }
        return editorWorker();
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


