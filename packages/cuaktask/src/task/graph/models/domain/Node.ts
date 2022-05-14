import { NodeDependencies } from './NodeDependencies';

export interface Node<T> {
  element: T;
  dependencies: NodeDependencies<T>;
}
