import { Node } from './Node';
import { NodeExecutionOperator } from './NodeExecutionOperator';

export interface NodeDependencies<T> {
  dependencies: (Node<T> | NodeDependencies<T>)[];
  operator: NodeExecutionOperator;
}
