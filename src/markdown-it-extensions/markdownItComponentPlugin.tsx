import MarkdownIt from 'markdown-it';
import StateCore from 'markdown-it/lib/rules_core/state_core';
import Token from 'markdown-it/lib/token';

export const enum markdownItJsxJSONs {
  CodeEditor = 'editor',
  Terminal = 'terminal',
}

export type markdownItComponentJson = {
  component: markdownItJsxJSONs;
  jsonProps: string;
};

export function markdownItComponentPlugin(componentTag: markdownItJsxJSONs) {
  return (mdIT: MarkdownIt, _options?: unknown) => {
    const openComponentString = `<${componentTag}>`;
    const closeComponentString = `</${componentTag}>`;
    function processToken(token: Token) {
      if (
        token.type === 'inline' &&
        token.content.includes(openComponentString) &&
        token.content.includes(closeComponentString)
      ) {
        token.children = [];
        token.content = token.content.substring(
          token.content.indexOf(openComponentString) +
            openComponentString.length,
          token.content.indexOf(closeComponentString)
        );
        token.type = componentTag;
      }
    }

    function processState(state: StateCore) {
      for (const token of state.tokens) {
        processToken(token);
      }
    }
    mdIT.core.ruler.push(`markdownIt${componentTag}Plugin`, processState);

    mdIT.renderer.rules[componentTag] = (tokens) => {
      const componentToken = tokens.find(
        (token) => token.type === componentTag
      );

      if (!componentToken) return '';
      return `{{${JSON.stringify({
        component: componentTag,
        jsonProps: componentToken.content,
      } as markdownItComponentJson)}}}`;
    };
  };
}
