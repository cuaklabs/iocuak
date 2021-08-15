export type PromiseIfThenable<T> = T extends PromiseLike<infer U>
  ? Promise<U>
  : T;
