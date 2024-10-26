export function formatValueBeforeSaveDb(obj: object, keys: string[]) {
  return keys.reduce(
    (acc, key) => ({ ...acc, [key]: obj[key] === null ? undefined : obj[key] }),
    {},
  );
}
