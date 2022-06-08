import { ReadOnlyLinkedList } from './ReadOnlyLinkedList';
import { ReadOnlyLinkedListNodeImplementation } from './ReadOnlyLinkedListNodeImplementation';

interface MapInReverseOrderCallbackResult {
  breakIteration: boolean;
}

export class ReadOnlyLinkedListImplementation<T>
  implements ReadOnlyLinkedList<T>
{
  readonly #last: ReadOnlyLinkedListNodeImplementation<T> | undefined;

  private constructor(
    last: ReadOnlyLinkedListNodeImplementation<T> | undefined,
  ) {
    this.#last = last;
  }

  public static build<T>(
    elems?: Iterable<T>,
  ): ReadOnlyLinkedListImplementation<T> {
    const nodeStack: ReadOnlyLinkedListNodeImplementation<T>[] = [];

    const getLastNode: () =>
      | ReadOnlyLinkedListNodeImplementation<T>
      | undefined = () => nodeStack[nodeStack.length - 1];

    if (elems !== undefined) {
      for (const elem of elems) {
        const node: ReadOnlyLinkedListNodeImplementation<T> =
          new ReadOnlyLinkedListNodeImplementation(elem, getLastNode());

        nodeStack.push(node);
      }
    }

    const list: ReadOnlyLinkedListImplementation<T> =
      new ReadOnlyLinkedListImplementation(getLastNode());

    return list;
  }

  public [Symbol.iterator](): Iterator<T> {
    const nodeStack: ReadOnlyLinkedListNodeImplementation<T>[] = [];

    this.#mapInReverseOrder(
      (node: ReadOnlyLinkedListNodeImplementation<T>): void => {
        nodeStack.push(node);
      },
    );

    const iterator: Iterator<T> = {
      next: (): IteratorResult<T, undefined> => {
        const node: ReadOnlyLinkedListNodeImplementation<T> | undefined =
          nodeStack.pop();

        if (node === undefined) {
          return { done: true, value: undefined };
        } else {
          return { done: false, value: node.elem };
        }
      },
    };

    return iterator;
  }

  public concat(elem: T): ReadOnlyLinkedList<T> {
    const lastNode: ReadOnlyLinkedListNodeImplementation<T> =
      new ReadOnlyLinkedListNodeImplementation(elem, this.#last);

    const concatList: ReadOnlyLinkedList<T> =
      new ReadOnlyLinkedListImplementation(lastNode);

    return concatList;
  }

  public includes(compareFn: (elem: T) => boolean): boolean {
    let result: boolean = false;

    this.#mapInReverseOrder(
      (
        node: ReadOnlyLinkedListNodeImplementation<T>,
      ): MapInReverseOrderCallbackResult => {
        const comparisonResult: boolean = compareFn(node.elem);

        if (comparisonResult) {
          result = true;
        }

        return {
          breakIteration: comparisonResult,
        };
      },
    );

    return result;
  }

  #mapInReverseOrder(
    callback: (
      node: ReadOnlyLinkedListNodeImplementation<T>,
    ) => MapInReverseOrderCallbackResult | void,
  ): void {
    for (
      let node: ReadOnlyLinkedListNodeImplementation<T> | undefined =
        this.#last;
      node !== undefined;
      node = node.previous
    ) {
      const result: MapInReverseOrderCallbackResult | void = callback(node);

      if (result?.breakIteration === true) {
        break;
      }
    }
  }
}
