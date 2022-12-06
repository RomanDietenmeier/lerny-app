import React, { CSSProperties } from 'react';
import MonacoEditor from "@monaco-editor/react";
import { editor } from 'monaco-editor';
import { DefaultSpinner } from '../constants/Spinners';

const options: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
};

export function Editor(): JSX.Element {
    return <MonacoEditor
        theme="vs-dark"
        options={options}
        defaultLanguage="javascript"
        defaultValue="// some comment"
        loading={<DefaultSpinner />}
        wrapperProps={{ style: { display: 'flex', position: 'relative', textAlign: 'initial', width: '100%', height: '100%', minHeight: '5rem' } as CSSProperties }}
    />
};
