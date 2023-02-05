import React from 'react';
import MarkdownIt from 'markdown-it';
import { markdownItExternalLinksPlugin } from '../markdown-it-extensions/markdownItExternalLinksPlugin';
import {
  markdownItJsxJSONs,
  markdownItComponentJson,
  markdownItComponentPlugin,
} from '../markdown-it-extensions/markdownItComponentPlugin';
import { CodeEditor } from '../web-components/code-editor/CodeEditor';
import { XTermTerminal } from '../web-components/terminal/XTermTerminal';
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
  let endCurlyBraces = -1;
  while (startCurlyBraces > -1) {
    try {
      endCurlyBraces = markdown.indexOf('}}', startCurlyBraces);
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
            const parsedJson = JSON.parse(json.jsonProps);
            jsxElements.push(<CodeEditor key={index++} {...parsedJson} />);
          } catch (err) {
            if (json.jsonProps.length > 0) {
              console.error(err);
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
          } catch (err) {
            if (json.jsonProps.length > 0) {
              console.error(err);
            }

            jsxElements.push(<XTermTerminal key={index++} />);
          }
          break;
        }
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        continue;
      }
      console.error(err);
      break;
    } finally {
      markdown = markdown.substring(endCurlyBraces + 3);
      startCurlyBraces = markdown.indexOf('{{');
    }
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
