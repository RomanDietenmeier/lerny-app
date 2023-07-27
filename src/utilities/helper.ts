import { editor } from 'monaco-editor';

export function sliceObjectInTwo<T>(obj: object): [T, T] {
  const entries = Object.entries(obj);
  const halfMark = Math.ceil(entries.length / 2);

  return [
    entries.slice(0, halfMark).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as Record<string, unknown>) as T,
    entries.slice(halfMark).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as Record<string, unknown>) as T,
  ];
}

export function stringToBinary(s: string): string {
  const codeUnits = Uint16Array.from({ length: s.length }, (element, index) =>
    s.charCodeAt(index)
  );
  const charCodes = new Uint8Array(codeUnits.buffer);

  let result = '';
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
}

export function stringFromBinary(binary: string): string {
  const bytes = Uint8Array.from({ length: binary.length }, (element, index) =>
    binary.charCodeAt(index)
  );
  const charCodes = new Uint16Array(bytes.buffer);

  let result = '';
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
}

export const enum ChunkType {
  Markdown,
  WebComponent,
}
export type ContentChunk = {
  type: ChunkType;
  content: string;
};
export function transformContentToChunks(content: string): Array<ContentChunk> {
  const componentPattern =
    /(<executable-code-editor[\S\s]*<\/executable-code-editor>)|(<code-editor[\S\s]*<\/code-editor>)/gm;

  const splits = content.split(componentPattern);

  const chunks = splits
    .filter((split) => split !== undefined)
    .map((split) => split.trim());

  const result: Array<ContentChunk> = [];
  for (const chunk of chunks) {
    result.push({
      type: chunk.match(componentPattern)
        ? ChunkType.WebComponent
        : ChunkType.Markdown,
      content: chunk,
    });
  }

  return result;
}

export function getContentFromEditors(
  editors: Array<editor.IStandaloneCodeEditor | undefined>
): string {
  const contentArray = editors.map((editor) =>
    !editor ? '' : editor.getValue()
  );
  return contentArray.join('\r\n\r\n');
}
