import { Node } from './Node';
import { NodeDependenciesType } from './NodeExecutionOperator';

export interface NodeDependencies<T> {
  dependencies: (Node<T> | NodeDependencies<T>)[];
  type: NodeDependenciesType;
}
