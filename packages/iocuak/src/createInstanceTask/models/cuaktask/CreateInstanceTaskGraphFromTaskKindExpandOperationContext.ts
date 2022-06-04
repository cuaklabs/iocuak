import { TaskKind } from '../domain/TaskKind';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';

export interface CreateInstanceTaskGraphFromTaskKindExpandOperationContext<
  TTaskKind extends TaskKind,
> extends CreateInstanceTaskGraphExpandOperationContext {
  taskKind: TTaskKind;
}
