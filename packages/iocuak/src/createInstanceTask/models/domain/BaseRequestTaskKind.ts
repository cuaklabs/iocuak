import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export interface BaseRequestTaskKind<
  TTaskKindType extends TaskKindType = TaskKindType,
> extends BaseTaskKind<TTaskKindType> {
  requestId: symbol;
}
