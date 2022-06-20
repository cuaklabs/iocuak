import { Binding } from '../../../binding/models/domain/Binding';
import { BaseRequestTaskKind } from './BaseRequestTaskKind';
import { TaskKindType } from './TaskKindType';

export interface CreateInstanceTaskKind<TBinding extends Binding = Binding>
  extends BaseRequestTaskKind<TaskKindType.createInstance> {
  binding: TBinding;
}
