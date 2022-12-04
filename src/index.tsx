import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './components/Editor';
import * as monaco from "monaco-editor";

import { loader } from "@monaco-editor/react";


self.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
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

(async () => {
    await loader.init();
    ReactDOM.render(
        <React.StrictMode>
            <div style={{ width: '100%', height: '100%' }}>
                <p>Test99</p>
                <Editor />
            </div>
        </React.StrictMode>,
        document.getElementById('root')
    );
})();


