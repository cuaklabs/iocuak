import { BaseNodeDependencies } from './BaseNodeDependencies';
import { Node } from './Node';
import { NodeDependencies } from './NodeDependencies';
import { NodeDependenciesType } from './NodeExecutionOperator';

export interface ResolvedNodeDependencies<
  TType extends NodeDependenciesType,
  TElem,
> extends BaseNodeDependencies<TType> {
  dependencies: (Node<TElem> | NodeDependencies<TElem>)[];
}
