import { LazyNodeDependencies } from './LazyNodeDependencies';
import { NodeDependenciesType } from './NodeExecutionOperator';
import { ResolvedNodeDependencies } from './ResolvedNodeDependencies';

export type NodeDependencies<TElem> =
  | ResolvedNodeDependencies<NodeDependenciesType.and, TElem>
  | ResolvedNodeDependencies<NodeDependenciesType.orElse, TElem>
  | LazyNodeDependencies<TElem>;
