export type NonThenableProperties<T> = {
  [TKey in keyof T]: T[TKey] extends PromiseLike<unknown> ? never : T[TKey];
};
