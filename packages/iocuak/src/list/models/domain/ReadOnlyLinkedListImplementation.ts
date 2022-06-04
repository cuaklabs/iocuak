import { ReadOnlyLinkedList } from './ReadOnlyLinkedList';
import { ReadOnlyLinkedListNodeImplementation } from './ReadOnlyLinkedListNodeImplementation';

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

  public concat(elem: T): ReadOnlyLinkedList<T> {
    const lastNode: ReadOnlyLinkedListNodeImplementation<T> =
      new ReadOnlyLinkedListNodeImplementation(elem, this.#last);

    const concatList: ReadOnlyLinkedList<T> =
      new ReadOnlyLinkedListImplementation(lastNode);

    return concatList;
  }

  public includes(compareFn: (elem: T) => boolean): boolean {
    let result: boolean = false;

    for (
      let node: ReadOnlyLinkedListNodeImplementation<T> | undefined =
        this.#last;
      node !== undefined;
      node = node.previous
    ) {
      if (compareFn(node.elem)) {
        result = true;
        break;
      }
    }

    return result;
  }
}
