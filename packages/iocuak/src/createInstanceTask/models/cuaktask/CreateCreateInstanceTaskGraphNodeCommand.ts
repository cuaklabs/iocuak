import { Binding } from '../../../binding/models/domain/Binding';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { CreateInstanceTaskGraphFromTaskKindExpandOperationContext } from './CreateInstanceTaskGraphFromTaskKindExpandOperationContext';

export interface CreateCreateInstanceTaskGraphNodeCommand<
  TBinding extends Binding = Binding,
> {
  context: CreateInstanceTaskGraphFromTaskKindExpandOperationContext<
    CreateInstanceTaskKind<TBinding>
  >;
}
