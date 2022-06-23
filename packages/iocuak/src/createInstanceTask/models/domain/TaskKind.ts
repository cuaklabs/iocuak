import { CreateInstanceRootTaskKind } from './CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from './CreateInstanceTaskKind';
import { CreateTagInstancesTaskKind } from './CreateTagInstancesTaskKind';
import { DestructureOneTaskKind } from './DestructureOneTaskKind';
import { GetCachedInstanceTaskKind } from './GetCachedInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from './GetInstanceDependenciesTaskKind';

export type TaskKind =
  | CreateInstanceTaskKind
  | CreateInstanceRootTaskKind
  | CreateTagInstancesTaskKind
  | DestructureOneTaskKind
  | GetCachedInstanceTaskKind
  | GetInstanceDependenciesTaskKind;
