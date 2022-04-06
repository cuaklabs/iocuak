import { PromiseLikeResult } from './PromiseLikeResult';

export type FlatPromise<T> = Promise<PromiseLikeResult<T>>;
