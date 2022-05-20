import { TaskKindType } from './TaskKindType';

export interface BaseTaskKind<
  TTaskKindType extends TaskKindType = TaskKindType,
> {
  requestId: symbol;
  type: TTaskKindType;
}
