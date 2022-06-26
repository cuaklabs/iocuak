import { CreateInstanceTaskNodeExpandCommand } from './CreateInstanceTaskNodeExpandCommand';
import { CreateTagInstancesTaskNodeExpandCommand } from './CreateTagInstancesTaskNodeExpandCommand';
import { GetInstanceDependenciesTaskNodeExpandCommand } from './GetInstanceDependenciesTaskNodeExpandCommand';

export type TaskNodeExpandCommand =
  | CreateInstanceTaskNodeExpandCommand
  | CreateTagInstancesTaskNodeExpandCommand
  | GetInstanceDependenciesTaskNodeExpandCommand;
