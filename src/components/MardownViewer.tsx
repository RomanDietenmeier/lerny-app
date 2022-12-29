import React from 'react';
import MarkdownIt from 'markdown-it';
import { externalLinksPlugin } from '../markdown-it-extensions/externalLinksPlugin';
const md = MarkdownIt('default', {
  html: true,
  linkify: true,
  typographer: true,
});

md.use(externalLinksPlugin);

type MarkdownViewerProps = {
  content: string;
};

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />;
}
