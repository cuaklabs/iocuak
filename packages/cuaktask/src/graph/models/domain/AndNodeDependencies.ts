import { BaseNodeDependencies } from './BaseNodeDependencies';
import { NodeDependenciesType } from './NodeDependenciesType';

export type AndNodeDependencies<TElem> = BaseNodeDependencies<
  NodeDependenciesType.and,
  TElem
>;
