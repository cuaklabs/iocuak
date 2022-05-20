import { CreateInstanceRootTaskKind } from './CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from './CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from './GetInstanceDependenciesTaskKind';

export type TaskKind =
  | CreateInstanceTaskKind
  | CreateInstanceRootTaskKind
  | GetInstanceDependenciesTaskKind;
