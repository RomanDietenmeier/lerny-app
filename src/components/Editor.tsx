import React from 'react';
import MonacoEditor from "@monaco-editor/react";
import { editor } from 'monaco-editor';

const options: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
};

export function Editor(): JSX.Element {
    return <MonacoEditor
        theme="vs-dark"
        options={options}
        defaultLanguage="javascript"
        defaultValue="// some comment"
    />
};
