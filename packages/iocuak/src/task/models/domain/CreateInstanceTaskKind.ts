import { Binding } from '../../../binding/models/domain/Binding';
import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export interface CreateInstanceTaskKind<TBinding extends Binding = Binding>
  extends BaseTaskKind<TaskKindType.createInstance> {
  binding: TBinding;
}
