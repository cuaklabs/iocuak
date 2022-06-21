export function mapIterator<TIn, TOut>(
  iterator: Iterator<TIn>,
  callback: (input: TIn) => TOut,
): Iterator<TOut> {
  return {
    next() {
      const result: IteratorResult<TIn> = iterator.next();

      if (result.done === true) {
        return result;
      } else {
        return {
          done: false,
          value: callback(result.value),
        };
      }
    },
  };
}
