export interface ReadOnlyLinkedList<T> extends Iterable<T> {
  concat(elem: T): ReadOnlyLinkedList<T>;
  includes(compareFn: (elem: T) => boolean): boolean;
}
