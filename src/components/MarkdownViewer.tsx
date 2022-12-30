import React from 'react';
import MarkdownIt from 'markdown-it';
import { markdownItExternalLinksPlugin } from '../markdown-it-extensions/externalLinksPlugin';
import {
  CodeEditorJson,
  JSXJSONs,
  markdownItEditorPlugin,
} from '../markdown-it-extensions/editorPlugin';
import { CodeEditor } from './CodeEditor';

const md = MarkdownIt('default', {
  html: true,
  linkify: true,
  typographer: true,
});

md.use(markdownItExternalLinksPlugin);
md.use(markdownItEditorPlugin);

function renderMarkdownToJSX(markdown: string) {
  markdown = md.render(markdown);
  const jsxElements: Array<JSX.Element> = [];
  let index = 0;
  let startCurlyBraces = markdown.indexOf('{{');
  while (startCurlyBraces > -1) {
    const endCurlyBraces = markdown.indexOf('}}', startCurlyBraces);
    const html = markdown.substring(0, startCurlyBraces);

    jsxElements.push(
      <span key={index++} dangerouslySetInnerHTML={{ __html: html }} />
    );

    console.log(
      'json',
      markdown.substring(startCurlyBraces + 2, endCurlyBraces + 1),
      endCurlyBraces,
      markdown
    );

    const json = JSON.parse(
      markdown.substring(startCurlyBraces + 2, endCurlyBraces + 1)
    ) as CodeEditorJson;

    switch (json.component) {
      case JSXJSONs.CodeEditor: {
        try {
          jsxElements.push(
            <CodeEditor key={index++} {...JSON.parse(json.jsonProps)} />
          );
        } catch (error) {
          if (json.jsonProps.length > 0) {
            console.error(error);
          }

          jsxElements.push(<CodeEditor key={index++} />);
        }
      }
    }
    markdown = markdown.substring(endCurlyBraces + 3);
    startCurlyBraces = markdown.indexOf('{{');
  }
  jsxElements.push(
    <span key={index++} dangerouslySetInnerHTML={{ __html: markdown }} />
  );

  return jsxElements;
}

type MarkdownViewerProps = {
  content: string;
};

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {renderMarkdownToJSX(content).map((element) => element)}
    </div>
  );
}
