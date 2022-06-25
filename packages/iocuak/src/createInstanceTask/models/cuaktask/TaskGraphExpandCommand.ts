import { CreateInstanceTaskGraphExpandCommand } from './CreateInstanceTaskGraphExpandCommand';
import { CreateTagInstancesTaskGraphExpandCommand } from './CreateTagInstancesTaskGraphExpandCommand';
import { GetInstanceDependenciesTaskGraphExpandCommand } from './GetInstanceDependenciesTaskGraphExpandCommand';

export type TaskGraphExpandCommand =
  | CreateInstanceTaskGraphExpandCommand
  | CreateTagInstancesTaskGraphExpandCommand
  | GetInstanceDependenciesTaskGraphExpandCommand;
