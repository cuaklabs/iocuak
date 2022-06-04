export interface ReadOnlyLinkedList<T> {
  concat(elem: T): ReadOnlyLinkedList<T>;
  includes(compareFn: (elem: T) => boolean): boolean;
}
