import React from 'react';
import MarkdownIt from 'markdown-it';
const md = MarkdownIt();

export function MarkdownViewer() {
  return <div dangerouslySetInnerHTML={{ __html: md.render('# Title') }} />;
}
