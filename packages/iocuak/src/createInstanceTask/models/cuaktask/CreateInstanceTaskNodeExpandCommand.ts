import { Task } from '@cuaklabs/cuaktask';

import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { BaseTaskNodeExpandCommand } from './BaseTaskNodeExpandCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from './CreateInstanceTaskNodeExpandOperationContext';
import { TaskNodeExpandCommandType } from './TaskNodeExpandCommandType';

export type CreateInstanceTaskNodeExpandCommand = BaseTaskNodeExpandCommand<
  CreateInstanceTaskNodeExpandOperationContext,
  TaskNodeExpandCommandType.createInstance,
  Task<CreateInstanceTaskKind>
>;
