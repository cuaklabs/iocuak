import { Task } from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';

export type CreateInstanceTaskGraphExpandCommand = TaskGraphExpandCommand<
  CreateInstanceTaskGraphExpandOperationContext,
  TaskKindType.createInstance,
  Task<CreateInstanceTaskKind>
>;
