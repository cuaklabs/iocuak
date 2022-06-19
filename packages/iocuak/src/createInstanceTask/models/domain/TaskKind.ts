import { CreateInstanceRootTaskKind } from './CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from './CreateInstanceTaskKind';
import { DestructureOneTaskKind } from './DestructureOneTaskKind';
import { GetCachedInstanceTaskKind } from './GetCachedInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from './GetInstanceDependenciesTaskKind';

export type TaskKind =
  | CreateInstanceTaskKind
  | CreateInstanceRootTaskKind
  | DestructureOneTaskKind
  | GetCachedInstanceTaskKind
  | GetInstanceDependenciesTaskKind;
