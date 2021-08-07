export type MayBePromise<T> = T extends PromiseLike<infer U>
  ? Promise<U>
  : T | Promise<T>;
