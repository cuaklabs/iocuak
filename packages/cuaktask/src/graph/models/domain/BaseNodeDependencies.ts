import { NodeDependenciesType } from './NodeDependenciesType';
import { NodeDependency } from './NodeDependency';

export interface BaseNodeDependencies<
  TType extends NodeDependenciesType,
  TElem,
> {
  type: TType;
  dependencies: NodeDependency<TElem>[];
}
