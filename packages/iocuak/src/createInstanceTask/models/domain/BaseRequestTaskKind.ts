import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export type BaseRequestTaskKind<
  TTaskKindType extends TaskKindType = TaskKindType,
> = BaseTaskKind<TTaskKindType>;
