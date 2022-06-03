import { CreateInstanceRootTaskKind } from './CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from './CreateInstanceTaskKind';
import { GetCachedInstanceTaskKind } from './GetCachedInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from './GetInstanceDependenciesTaskKind';

export type TaskKind =
  | CreateInstanceTaskKind
  | CreateInstanceRootTaskKind
  | GetCachedInstanceTaskKind
  | GetInstanceDependenciesTaskKind;
