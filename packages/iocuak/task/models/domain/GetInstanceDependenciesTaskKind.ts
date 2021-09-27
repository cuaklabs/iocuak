import { TaskKind } from './TaskKind';
import { TaskKindType } from './TaskKindType';

export interface GetInstanceDependenciesTaskKind
  extends TaskKind<TaskKindType.getInstanceDependencies> {
  constructorArguments: number;
  properties: string[];
}
