import { ServiceId } from './ServiceId';
import { TaskKindType } from './TaskKindType';

export interface BaseTaskKind<
  TTaskKindType extends TaskKindType = TaskKindType,
> {
  id: ServiceId;
  requestId: symbol;
  type: TTaskKindType;
}
