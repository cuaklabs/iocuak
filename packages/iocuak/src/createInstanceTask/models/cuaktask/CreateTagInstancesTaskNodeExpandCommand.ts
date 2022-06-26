import * as cuaktask from '@cuaklabs/cuaktask';

import { CreateTagInstancesTaskKind } from '../domain/CreateTagInstancesTaskKind';
import { BaseTaskNodeExpandCommand } from './BaseTaskNodeExpandCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from './CreateInstanceTaskNodeExpandOperationContext';
import { TaskNodeExpandCommandType } from './TaskNodeExpandCommandType';

export type CreateTagInstancesTaskNodeExpandCommand = BaseTaskNodeExpandCommand<
  CreateInstanceTaskNodeExpandOperationContext,
  TaskNodeExpandCommandType.createTagInstances,
  cuaktask.Task<CreateTagInstancesTaskKind>
>;
