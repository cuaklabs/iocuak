import { TaskKind } from '../domain/TaskKind';
import { CreateInstanceTaskNodeExpandOperationContext } from './CreateInstanceTaskNodeExpandOperationContext';

export interface CreateInstanceTaskNodeFromTaskKindExpandOperationContext<
  TTaskKind extends TaskKind,
> extends CreateInstanceTaskNodeExpandOperationContext {
  taskKind: TTaskKind;
}
