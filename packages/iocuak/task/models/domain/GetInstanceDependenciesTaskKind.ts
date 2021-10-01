import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export interface GetInstanceDependenciesTaskKind
  extends BaseTaskKind<TaskKindType.getInstanceDependencies> {
  constructorArguments: number;
  properties: string[];
}
