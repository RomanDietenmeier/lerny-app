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
    /(<executable-code-editor\b[^>]*>[\S\s]*?<\/executable-code-editor>)|(<code-editor\b[^>]*>[\S\s]*?<\/code-editor>)/gm;

  const splits = content.split(componentPattern);

  const chunks = splits
    .filter((split) => split !== undefined) //filter undefined matches
    .map((split) => split.trim()) //trim whitespaces and linebreaks
    .filter((split) => split !== ''); //filter empty splits

  const result: Array<ContentChunk> = [];
  for (const chunk of chunks) {
    if (chunk === undefined) continue;
    result.push({
      type: chunk.match(componentPattern)
        ? ChunkType.WebComponent
        : ChunkType.Markdown,
      content: chunk,
    });
  }

  return result;
}

export function transformChunksToContent(chunks: Array<ContentChunk>): string {
  const contentArray = chunks.map((chunk) => chunk.content);
  return contentArray.join('\r\n\r\n');
}

export function renameDuplicateFile(
  learnProject: string,
  filename: string
): string {
  const existingPages =
    window.electron.learnProject.readProjectDirectory(learnProject);

  let count = 0;
  const regexp = new RegExp(`${filename}(\\(\\d+\\)|).lap`);

  for (const page of existingPages) {
    if (regexp.test(page)) count++;
  }
  let newFilename = filename;
  if (count > 0) {
    newFilename = `${filename}(${count})`;
  }
  return newFilename;
}
