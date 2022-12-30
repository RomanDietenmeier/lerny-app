import MarkdownIt from 'markdown-it';
import StateCore from 'markdown-it/lib/rules_core/state_core';
import Token from 'markdown-it/lib/token';

export const enum JSXJSONs {
  CodeEditor = 'CodeEditor',
}

export type CodeEditorJson = {
  component: JSXJSONs.CodeEditor;
  jsonProps: string;
};

export function markdownItEditorPlugin(mdIT: MarkdownIt, _options?: unknown) {
  const openEditorString = '<editor>';
  const closeEditorString = '</editor>';
  function processToken(token: Token) {
    if (
      token.type === 'inline' &&
      token.content.includes(openEditorString) &&
      token.content.includes(closeEditorString)
    ) {
      token.children = [];
      token.content = token.content.substring(
        token.content.indexOf(openEditorString) + openEditorString.length,
        token.content.indexOf(closeEditorString)
      );
      token.type = 'editor';
    }
  }

  function processState(state: StateCore) {
    for (const token of state.tokens) {
      processToken(token);
    }
  }
  mdIT.core.ruler.push('markdownItEditorPlugin', processState);

  mdIT.renderer.rules.editor = (tokens) => {
    const editorToken = tokens.find((token) => token.type === 'editor');
    if (!editorToken) return '';
    return `{{${JSON.stringify({
      component: 'CodeEditor',
      jsonProps: editorToken.content,
    } as CodeEditorJson)}}}`;
  };
}
