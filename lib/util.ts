export function toArray<T>(maybeArr: T | T[]): T[] {
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}
