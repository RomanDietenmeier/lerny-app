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
