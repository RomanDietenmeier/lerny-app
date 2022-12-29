import React from 'react';
import MarkdownIt from 'markdown-it';
const md = MarkdownIt();

type MarkdownViewerProps = {
  content: string;
};

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />;
}
