import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { CreateInstanceTaskGraphFromTaskKindExpandOperationContext } from './CreateInstanceTaskGraphFromTaskKindExpandOperationContext';

export interface CreateCreateInstanceTaskGraphNodeCommand {
  context: CreateInstanceTaskGraphFromTaskKindExpandOperationContext<
    CreateInstanceTaskKind<TypeBinding>
  >;
}
