import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { BaseRequestTaskKind } from './BaseRequestTaskKind';
import { TaskKindType } from './TaskKindType';

export interface GetCachedInstanceTaskKind
  extends BaseRequestTaskKind<TaskKindType.getCachedInstance> {
  binding: TypeBinding;
}
