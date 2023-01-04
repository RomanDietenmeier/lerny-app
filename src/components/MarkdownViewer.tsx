import React from 'react';
import MarkdownIt from 'markdown-it';
import { markdownItExternalLinksPlugin } from '../markdown-it-extensions/markdownItExternalLinksPlugin';
import {
  markdownItJsxJSONs,
  markdownItComponentJson,
  markdownItComponentPlugin,
} from '../markdown-it-extensions/markdownItComponentPlugin';
import { CodeEditor } from './CodeEditor';
import { XTermTerminal } from './XTermTerminal';
import { MarkdownViewerWrapper } from './MarkdownViewer.style';

const md = MarkdownIt('default', {
  html: true,
  linkify: true,
  typographer: true,
});

md.use(markdownItExternalLinksPlugin);
md.use(markdownItComponentPlugin(markdownItJsxJSONs.CodeEditor));
md.use(markdownItComponentPlugin(markdownItJsxJSONs.Terminal));

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

    const json = JSON.parse(
      markdown.substring(startCurlyBraces + 2, endCurlyBraces + 1)
    ) as markdownItComponentJson;

    switch (json.component) {
      case markdownItJsxJSONs.CodeEditor: {
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
        break;
      }
      case markdownItJsxJSONs.Terminal: {
        try {
          jsxElements.push(
            <XTermTerminal key={index++} {...JSON.parse(json.jsonProps)} />
          );
        } catch (error) {
          if (json.jsonProps.length > 0) {
            console.error(error);
          }

          jsxElements.push(<XTermTerminal key={index++} />);
        }
        break;
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
    <MarkdownViewerWrapper>
      {renderMarkdownToJSX(content).map((element) => element)}
    </MarkdownViewerWrapper>
  );
}
