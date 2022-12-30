import React from 'react';
import MarkdownIt from 'markdown-it';
import StateCore from 'markdown-it/lib/rules_core/state_core';
import Token from 'markdown-it/lib/token';
import { CodeEditor } from '../components/CodeEditor';

export function markdownItEditorPlugin(mdIT: MarkdownIt, _options?: unknown) {
  function processToken(token: Token) {
    if (
      token.type === 'inline' &&
      token.content.includes('<editor>') &&
      token.content.includes('</editor>')
    ) {
      token.children = [];
      token.type = 'editor';
    }
  }

  function processState(state: StateCore) {
    for (const token of state.tokens) {
      processToken(token);
    }
  }
  mdIT.core.ruler.push('markdownItEditorPlugin', processState);
  // @ts-expect-error trying something
  mdIT.renderer.rules.editor = () => {
    return <CodeEditor />;
  };
}
