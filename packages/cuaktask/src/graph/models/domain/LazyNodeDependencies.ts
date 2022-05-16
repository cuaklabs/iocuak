import { BaseNodeDependencies } from './BaseNodeDependencies';
import { NodeDependencies } from './NodeDependencies';
import { NodeDependenciesType } from './NodeDependenciesType';

export interface LazyNodeDependencies<TElem>
  extends BaseNodeDependencies<NodeDependenciesType.lazy, TElem> {
  dependencies: [NodeDependencies<TElem>];
}
