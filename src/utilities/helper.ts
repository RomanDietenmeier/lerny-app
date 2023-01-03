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
