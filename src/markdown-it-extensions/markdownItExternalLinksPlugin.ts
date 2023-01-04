import MarkdownIt from 'markdown-it';
import StateCore from 'markdown-it/lib/rules_core/state_core';
import Token from 'markdown-it/lib/token';

export function markdownItExternalLinksPlugin(mdIT: MarkdownIt) {
  function processToken(token: Token) {
    for (const childToken of token.children || []) {
      processToken(childToken);
    }

    if (token.type === 'html_inline' && token.content.includes('<a')) {
      const searchForHref = 'href=';
      let startIndex = token.content.indexOf(searchForHref);
      if (startIndex > 2) {
        startIndex += searchForHref.length;
        const quotationMark = token.content[startIndex];
        const endIndex = token.content.indexOf(quotationMark, startIndex + 1);
        const link = token.content.substring(startIndex + 1, endIndex);
        token.content = token.content.replace(
          quotationMark + link + quotationMark,
          `"javascript:void(0)" onclick="handleMarkdownAnchorClick('${link}')"`
        );
      }
    }

    if (token.tag === 'a' && token.type !== 'link_close') {
      token.attrPush([
        'onclick',
        `handleMarkdownAnchorClick('${token.attrGet('href')}')`,
      ]);
      token.attrSet('href', 'javascript:void(0)');
    }
  }

  function processExternalLinks(state: StateCore) {
    for (const token of state.tokens) {
      processToken(token);
    }
  }
  mdIT.core.ruler.push('markdownItExternalLinksPlugin', processExternalLinks);
}
