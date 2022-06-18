import { Task } from '@cuaklabs/cuaktask';

import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { BaseTaskGraphExpandCommand } from './BaseTaskGraphExpandCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommandType } from './TaskGraphExpandCommandType';

export type CreateInstanceTaskGraphExpandCommand = BaseTaskGraphExpandCommand<
  CreateInstanceTaskGraphExpandOperationContext,
  TaskGraphExpandCommandType.createInstance,
  Task<CreateInstanceTaskKind>
>;
