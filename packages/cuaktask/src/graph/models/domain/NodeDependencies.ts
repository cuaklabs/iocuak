import { BaseNodeDependencies } from './BaseNodeDependencies';
import { LazyNodeDependencies } from './LazyNodeDependencies';
import { NodeDependenciesType } from './NodeDependenciesType';

export type NodeDependencies<TElem> =
  | BaseNodeDependencies<NodeDependenciesType.and, TElem>
  | BaseNodeDependencies<NodeDependenciesType.orElse, TElem>
  | LazyNodeDependencies<TElem>;
