import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export interface BaseServiceTaskKind<
  TTaskKindType extends TaskKindType = TaskKindType,
> extends BaseTaskKind<TTaskKindType> {
  id: ServiceId;
}
