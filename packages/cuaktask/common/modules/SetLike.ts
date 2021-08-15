export interface SetLike<TElem> {
  add(elem: TElem): this;
  clear(): void;
  delete(elem: TElem): boolean;
  has(elem: TElem): boolean;
}
