import { MarkdownViewerWrapper as Wrapper } from 'components/MarkdownViewer.style';
import { webComponentTagsToWrap } from 'constants/webComponentTags';
import MarkdownIt from 'markdown-it';
import { markdownItExternalLinksPlugin } from 'markdown-it-extensions/markdownItExternalLinksPlugin';
import React from 'react';
import { stringToBinary } from 'utilities/helper';
import { base64Tag } from 'web-components/base64/base64ConverterWebComponent';

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
          `${base64Tag.open}${btoa(stringToBinary(componentSubstring))}${
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
    <Wrapper>
      <span
        dangerouslySetInnerHTML={{ __html: renderMarkdownToJSX(content) }}
      />
    </Wrapper>
  );
}
