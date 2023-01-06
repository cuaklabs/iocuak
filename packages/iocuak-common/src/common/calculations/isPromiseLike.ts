export function isPromiseLike<T>(object: unknown): object is PromiseLike<T> {
  // https://promisesaplus.com/
  const isObjectOrFunction: boolean =
    (typeof object === 'object' && object !== null) ||
    typeof object === 'function';

  return (
    isObjectOrFunction && typeof (object as PromiseLike<T>).then === 'function'
  );
}
