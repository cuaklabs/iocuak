import { Node } from './Node';
import { NodeDependencies } from './NodeDependencies';
import { NodeDependenciesType } from './NodeExecutionOperator';

export interface BaseNodeDependencies<
  TType extends NodeDependenciesType,
  TElem,
> {
  type: TType;
  dependencies: (Node<TElem> | NodeDependencies<TElem>)[];
}
