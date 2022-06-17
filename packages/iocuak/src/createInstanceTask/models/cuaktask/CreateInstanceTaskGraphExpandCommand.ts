import { Task } from '@cuaklabs/cuaktask';

import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommandBase } from './TaskGraphExpandCommandBase';
import { TaskGraphExpandCommandType } from './TaskGraphExpandCommandType';

export type CreateInstanceTaskGraphExpandCommand = TaskGraphExpandCommandBase<
  CreateInstanceTaskGraphExpandOperationContext,
  TaskGraphExpandCommandType.createInstance,
  Task<CreateInstanceTaskKind>
>;
