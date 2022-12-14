import React, { CSSProperties, ReactElement, useEffect, useRef } from 'react';
import MonacoEditor from "@monaco-editor/react";
import { editor } from 'monaco-editor';
import { DefaultSpinner } from '../constants/Spinners';

type MonacoEditorType = typeof import("c:/Users/roman/Projects/lerny-app/node_modules/monaco-editor/esm/vs/editor/editor.api");

const options: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
};

export function Editor(): JSX.Element {


    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: MonacoEditorType) {
        editorRef.current = editor;
    }
    function onKeyDown(evt: React.KeyboardEvent) {
        if (!editorRef.current) return;
        if (evt.key.toLowerCase() === 's' && window.keyPressMap['Control']) {
            console.log(editorRef.current.getValue());
            window.electron.saveTextFile(editorRef.current.getValue(), 'c.c');
        }
    }


    return <span onKeyDown={onKeyDown}><MonacoEditor
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={options}
        defaultLanguage="c"
        defaultValue={'#include<stdio.h>\n\nint main(int argc, char* argv[]){\n\n    for(int i=0;i<argc;i++){\n       printf("%2i %s\\n",i,argv[i]);\n    }\n}'}
        loading={<DefaultSpinner />}
        wrapperProps={{ style: { display: 'flex', position: 'relative', textAlign: 'initial', width: '100%', height: '100%', minHeight: '15rem' } as CSSProperties }}
    /></span>
};
