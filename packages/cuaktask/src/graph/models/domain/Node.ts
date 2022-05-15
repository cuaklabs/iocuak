import { NodeDependencies } from './NodeDependencies';

export interface Node<TElem> {
  element: TElem;
  dependencies: NodeDependencies<TElem>;
}
