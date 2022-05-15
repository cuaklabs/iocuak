import { NodeDependenciesType } from './NodeExecutionOperator';

export interface BaseNodeDependencies<TType extends NodeDependenciesType> {
  type: TType;
}
