export function isDefined<T>(obj: T): obj is Exclude<T, undefined> {
  return obj !== undefined;
}
