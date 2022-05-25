import { Task } from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKindType } from '../domain/TaskKindType';

export type CreateInstanceTaskGraphExpandCommand = TaskGraphExpandCommand<
  TaskKindType.createInstance,
  Task<CreateInstanceTaskKind>
>;
