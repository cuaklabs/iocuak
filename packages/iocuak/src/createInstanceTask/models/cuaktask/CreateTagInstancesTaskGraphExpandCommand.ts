import * as cuaktask from '@cuaklabs/cuaktask';

import { CreateTagInstancesTaskKind } from '../domain/CreateTagInstancesTaskKind';
import { BaseTaskGraphExpandCommand } from './BaseTaskGraphExpandCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommandType } from './TaskGraphExpandCommandType';

export type CreateTagInstancesTaskGraphExpandCommand =
  BaseTaskGraphExpandCommand<
    CreateInstanceTaskGraphExpandOperationContext,
    TaskGraphExpandCommandType.createTagInstances,
    cuaktask.Task<CreateTagInstancesTaskKind>
  >;
