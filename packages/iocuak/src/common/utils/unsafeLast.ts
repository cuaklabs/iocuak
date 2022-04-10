export function unsafeLast<T>(array: T[]): T {
  return array[array.length - 1] as T;
}
