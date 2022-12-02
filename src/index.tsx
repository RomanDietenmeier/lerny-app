import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './components/Editor';

ReactDOM.render(
    <React.StrictMode>
        <div style={{ width: '100vw', height: '100vh' }}>
            <Editor />
        </div>
    </React.StrictMode>,
    document.getElementById('root')
);