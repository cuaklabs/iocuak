import { Binding } from '../../../binding/models/domain/Binding';
import { BaseServiceTaskKind } from './BaseServiceTaskKind';
import { TaskKindType } from './TaskKindType';

export interface CreateInstanceTaskKind<TBinding extends Binding = Binding>
  extends BaseServiceTaskKind<TaskKindType.createInstance> {
  binding: TBinding;
}
