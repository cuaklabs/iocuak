import { CreateInstanceTaskGraphExpandCommand } from './CreateInstanceTaskGraphExpandCommand';
import { GetInstanceDependenciesTaskGraphExpandCommand } from './GetInstanceDependenciesTaskGraphExpandCommand';

export type TaskGraphExpandCommand =
  | CreateInstanceTaskGraphExpandCommand
  | GetInstanceDependenciesTaskGraphExpandCommand;
