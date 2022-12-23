import React, { CSSProperties, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { editor, KeyMod, KeyCode } from 'monaco-editor';
import { DefaultSpinner } from '../constants/Spinners';

type MonacoEditorType =
    typeof import('../../node_modules/monaco-editor/esm/vs/editor/editor.api');

const options: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
};

export function Editor(): JSX.Element {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);


    function save() {
        if (!editorRef.current) return;
        console.log(editorRef.current.getValue());
        window.electron.saveTextFile(editorRef.current.getValue(), 'c.c');
    }

    function handleEditorDidMount(
        editor: editor.IStandaloneCodeEditor,
        _monaco: MonacoEditorType
    ) {
        editorRef.current = editor;
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
            save();
        });
    }



    return (
        <span>
            <MonacoEditor
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={options}
                defaultLanguage="c"
                defaultValue={
                    '#include<stdio.h>\n\nint main(int argc, char* argv[]){\n\n    for(int i=0;i<argc;i++){\n       printf("%2i %s\\n",i,argv[i]);\n    }\n}'
                }
                loading={<DefaultSpinner />}
                wrapperProps={{
                    style: {
                        display: 'flex',
                        position: 'relative',
                        textAlign: 'initial',
                        width: '100%',
                        height: '100%',
                        minHeight: '15rem',
                    } as CSSProperties,
                }}
            />
        </span>
    );
}
