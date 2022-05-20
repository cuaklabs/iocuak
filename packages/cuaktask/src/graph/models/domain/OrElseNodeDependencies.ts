import { BaseNodeDependencies } from './BaseNodeDependencies';
import { NodeDependenciesType } from './NodeDependenciesType';

export type OrElseNodeDependencies<TElem> = BaseNodeDependencies<
  NodeDependenciesType.bitwiseOr,
  TElem
>;
