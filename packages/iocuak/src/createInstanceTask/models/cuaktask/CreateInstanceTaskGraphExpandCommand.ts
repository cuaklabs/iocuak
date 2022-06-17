import { Task } from '@cuaklabs/cuaktask';

import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommandBase } from './TaskGraphExpandCommandBase';

export type CreateInstanceTaskGraphExpandCommand = TaskGraphExpandCommandBase<
  CreateInstanceTaskGraphExpandOperationContext,
  TaskKindType.createInstance,
  Task<CreateInstanceTaskKind>
>;
