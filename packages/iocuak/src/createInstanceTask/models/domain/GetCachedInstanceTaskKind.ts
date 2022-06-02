import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export interface GetCachedInstanceTaskKind
  extends BaseTaskKind<TaskKindType.getCachedInstance> {
  binding: TypeBinding;
}
