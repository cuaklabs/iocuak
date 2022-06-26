import { Binding } from '../../../binding/models/domain/Binding';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { CreateInstanceTaskNodeFromTaskKindExpandOperationContext } from './CreateInstanceTaskNodeFromTaskKindExpandOperationContext';

export interface CreateCreateInstanceTaskNodeCommand<
  TBinding extends Binding = Binding,
> {
  context: CreateInstanceTaskNodeFromTaskKindExpandOperationContext<
    CreateInstanceTaskKind<TBinding>
  >;
}
