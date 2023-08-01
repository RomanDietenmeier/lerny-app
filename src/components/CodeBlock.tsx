import React, { useEffect, useState } from 'react';
import {
  CodeBlockInput,
  CodeBlockAttribute,
  CodeBlockWrapper,
  CodeBlockSelect,
  CodeBlockInputFill,
} from './CodeBlock.styles';
import { RowItemsSpaced } from 'styles/layout.style';
import {
  CodeEditor,
  EditorType,
  defaultMonacoWrapperStyle,
} from 'web-components/code-editor/CodeEditor';
import { retrieveExecutableCodeEditorData } from 'utilities/xml';

const LANGUAGES = ['c', 'java', 'python'];

function attributesToContent(
  filename: string,
  language: string,
  code: string,
  buildCommand?: string,
  runCommand?: string,
  testCommand?: string
): string {
  let transformedCode = code.replace(/</g, '&lt;');
  transformedCode = transformedCode.replace(/>/g, '&gt;');

  const xmlContentArray = [
    '<xml>',
    `<starter-code>${transformedCode}</starter-code>`,
  ];
  if (buildCommand !== undefined) {
    xmlContentArray.push(
      `<build-command>\r\n${buildCommand}\r\n</build-command>`
    );
  }
  if (runCommand !== undefined) {
    xmlContentArray.push(`<run-command>\r\n${runCommand}\r\n</run-command>`);
  }
  if (testCommand !== undefined) {
    xmlContentArray.push(`<test-command>\r\n${testCommand}\r\n</test-command>`);
  }
  xmlContentArray.push('</xml>');
  const xmlContent = xmlContentArray.join('\r\n\r\n');

  const result = `<executable-code-editor\r\nlanguage="${language}"\r\nfilename="${filename}"\r\n>\r\n\r\n${xmlContent}\r\n\r\n</executable-code-editor>`;

  return result;
}

type CodeBlockProps = {
  content: string;
  onValueChanged?: (value: string) => void;
};
export function CodeBlock({
  content,
  onValueChanged: handleOnValueChanged,
}: CodeBlockProps) {
  const {
    executableCodeEditorAttributes,
    executableCodeEditorBuild,
    executableCodeEditorRun,
    executableCodeEditorTest,
    executableCodeEditorCode,
  } = retrieveExecutableCodeEditorData(content);
  const [filenameInput, setFilenameInput] = useState(
    executableCodeEditorAttributes?.filename
  );
  const [languageSelect, setLanguageSelect] = useState(
    executableCodeEditorAttributes?.language
  );
  const [buildInput, setBuildInput] = useState(executableCodeEditorBuild);
  const [runInput, setRunInput] = useState(executableCodeEditorRun);
  const [testInput, setTestInput] = useState(executableCodeEditorTest);
  const [code, setCode] = useState(executableCodeEditorCode);

  useEffect(() => {
    if (!handleOnValueChanged || !filenameInput || !languageSelect || !code)
      return;

    handleOnValueChanged(
      attributesToContent(
        filenameInput,
        languageSelect,
        code,
        buildInput,
        runInput,
        testInput
      )
    );
  }, [filenameInput, languageSelect, buildInput, runInput, testInput, code]);

  function handleChangeFilenameInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setFilenameInput(event.currentTarget.value);
  }
  function handleChangeLanguageSelect(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setLanguageSelect(event.currentTarget.value);
  }

  function handleChangeBuildInput(event: React.ChangeEvent<HTMLInputElement>) {
    setBuildInput(event.currentTarget.value);
  }
  function handleChangeRunInput(event: React.ChangeEvent<HTMLInputElement>) {
    setRunInput(event.currentTarget.value);
  }
  function handleChangeTestInput(event: React.ChangeEvent<HTMLInputElement>) {
    setTestInput(event.currentTarget.value);
  }

  function handleCodeChanged(value: string) {
    setCode(value);
  }

  return (
    <CodeBlockWrapper>
      <RowItemsSpaced>
        <CodeBlockAttribute>
          <div>Filename:</div>
          <CodeBlockInput
            value={filenameInput}
            onChange={handleChangeFilenameInput}
          />
        </CodeBlockAttribute>
        <CodeBlockAttribute>
          <div>Language:</div>
          <CodeBlockSelect
            value={languageSelect}
            onChange={handleChangeLanguageSelect}
          >
            {LANGUAGES.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </CodeBlockSelect>
        </CodeBlockAttribute>
      </RowItemsSpaced>
      <CodeEditor
        monacoEditorProps={{
          language: languageSelect,
          wrapperProps: {
            style: {
              ...defaultMonacoWrapperStyle,
            },
          },
        }}
        editorType={EditorType.Code}
        initialCodeEditorValue={executableCodeEditorCode}
        onValueChanged={handleCodeChanged}
      />
      <CodeBlockAttribute>
        <div style={{ flexShrink: '0' }}>Build-Command:</div>
        <CodeBlockInputFill
          value={buildInput}
          onChange={handleChangeBuildInput}
        />
      </CodeBlockAttribute>
      <CodeBlockAttribute>
        <div style={{ flexShrink: '0' }}>Run-Command:</div>
        <CodeBlockInputFill value={runInput} onChange={handleChangeRunInput} />
      </CodeBlockAttribute>
      <CodeBlockAttribute>
        <div style={{ flexShrink: '0' }}>Test-Command:</div>
        <CodeBlockInputFill
          value={testInput}
          onChange={handleChangeTestInput}
        />
      </CodeBlockAttribute>
    </CodeBlockWrapper>
  );
}
