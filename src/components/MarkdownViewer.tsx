import React from 'react';
import MarkdownIt from 'markdown-it';
import { markdownItExternalLinksPlugin } from 'markdown-it-extensions/markdownItExternalLinksPlugin';
import { MarkdownViewerWrapper } from 'components/MarkdownViewer.style';
import * as base64 from 'base-64';
import { base64Tag } from 'web-components/base64/base64ConverterWebComponent';
import { webComponentTagsToWrap } from 'constants/webComponentTags';

const md = MarkdownIt('default', {
  html: true,
  linkify: true,
  typographer: true,
});

md.use(markdownItExternalLinksPlugin);

function renderMarkdownToJSX(markdown: string) {
  for (const componentTag of webComponentTagsToWrap) {
    const openComponentString = `<${componentTag}`;
    const closeComponentString = `</${componentTag}>`;

    let startPoint = 0;

    while (startPoint > -1) {
      const startComponentIndex = markdown.indexOf(
        openComponentString,
        startPoint
      );
      const endStartComponentIndex = markdown.indexOf(
        closeComponentString,
        startPoint
      );
      const endComponentIndex =
        endStartComponentIndex + closeComponentString.length;

      if (startComponentIndex > -1 && endStartComponentIndex > -1) {
        const componentSubstring = markdown.substring(
          startComponentIndex,
          endComponentIndex
        );
        markdown = markdown.replace(
          componentSubstring,
          `${base64Tag.open}${base64.encode(componentSubstring)}${
            base64Tag.end
          }`
        );
      }

      startPoint =
        endStartComponentIndex > startPoint ? endStartComponentIndex : -1;
    }
  }

  return md.render(markdown);
}

type MarkdownViewerProps = {
  content: string;
};

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <MarkdownViewerWrapper>
      <span
        dangerouslySetInnerHTML={{ __html: renderMarkdownToJSX(content) }}
      />
    </MarkdownViewerWrapper>
  );
}
