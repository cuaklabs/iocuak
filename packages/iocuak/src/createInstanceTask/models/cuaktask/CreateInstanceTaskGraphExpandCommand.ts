import { Task } from '@cuaklabs/cuaktask';

import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommand } from './TaskGraphExpandCommand';

export type CreateInstanceTaskGraphExpandCommand = TaskGraphExpandCommand<
  CreateInstanceTaskGraphExpandOperationContext,
  TaskKindType.createInstance,
  Task<CreateInstanceTaskKind>
>;
