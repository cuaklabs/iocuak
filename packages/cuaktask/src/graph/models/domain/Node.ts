import { NodeDependencies } from './NodeDependencies';

export interface Node<TElem, TDependencyElem = TElem> {
  element: TElem;
  dependencies: NodeDependencies<TDependencyElem> | undefined;
}
