export type FlatPromise<T> = Promise<T extends PromiseLike<infer U> ? U : T>;
