import React from 'react';
import MarkdownIt from 'markdown-it';
import { markdownItExternalLinksPlugin } from '../markdown-it-extensions/externalLinksPlugin';
import { markdownItEditorPlugin } from '../markdown-it-extensions/editorPlugin';

const md = MarkdownIt('default', {
  html: true,
  linkify: true,
  typographer: true,
});

md.use(markdownItExternalLinksPlugin);
md.use(markdownItEditorPlugin);

type MarkdownViewerProps = {
  content: string;
};

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const markdownContent = md.render(content) as unknown as Array<
    string | JSX.Element
  >;

  let currentContentElement = '';
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {markdownContent.map((content, index) => {
        switch (typeof content) {
          case 'object': {
            const html = currentContentElement;
            currentContentElement = '';
            return (
              <span key={index}>
                {!html ? null : (
                  <span dangerouslySetInnerHTML={{ __html: html }} />
                )}
                <span>{content}</span>
              </span>
            );
          }
          case 'string': {
            currentContentElement += content;
            if (index === markdownContent.length - 1) {
              const html = currentContentElement;
              currentContentElement = '';
              if (!html) return;
              return (
                <span key={index} dangerouslySetInnerHTML={{ __html: html }} />
              );
            }
          }
        }
      })}
    </div>
  );
}
