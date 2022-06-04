export class ReadOnlyLinkedListNodeImplementation<T> {
  constructor(
    public readonly elem: T,
    public readonly previous:
      | ReadOnlyLinkedListNodeImplementation<T>
      | undefined,
  ) {}
}
