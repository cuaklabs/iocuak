import { BaseRequestTaskKind } from './BaseRequestTaskKind';
import { BaseServiceTaskKind } from './BaseServiceTaskKind';
import { TaskKindType } from './TaskKindType';

export type CreateInstanceRootTaskKind =
  BaseServiceTaskKind<TaskKindType.createInstanceRoot> &
    BaseRequestTaskKind<TaskKindType.createInstanceRoot>;
