export type PromiseLikeResult<T> = T extends PromiseLike<infer U> ? U : T;
