import { BaseServiceTaskKind } from './BaseServiceTaskKind';
import { TaskKindType } from './TaskKindType';

export type CreateInstanceTaskKind =
  BaseServiceTaskKind<TaskKindType.createInstance>;
