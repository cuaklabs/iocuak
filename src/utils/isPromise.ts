export function isPromise<T>(object: unknown): object is Promise<T> {
  // https://promisesaplus.com/
  const isObjectOrFunction: boolean =
    (typeof object === 'object' && object !== null) ||
    typeof object === 'function';

  return (
    isObjectOrFunction && typeof (object as PromiseLike<T>).then === 'function'
  );
}
