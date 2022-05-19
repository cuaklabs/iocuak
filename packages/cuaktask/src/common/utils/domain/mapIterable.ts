import { mapIterator } from './mapIterator';

export function mapIterable<TIn, TOut>(
  iterable: Iterable<TIn>,
  callback: (input: TIn) => TOut,
): Iterable<TOut> {
  const iterator: Iterator<TIn> = iterable[Symbol.iterator]();
  const mappedIterator: Iterator<TOut> = mapIterator(iterator, callback);

  return {
    [Symbol.iterator]: () => mappedIterator,
  };
}
