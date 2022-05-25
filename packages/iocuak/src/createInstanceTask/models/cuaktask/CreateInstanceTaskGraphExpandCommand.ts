import { Node, Task } from '@cuaklabs/cuaktask';

import { GraphExpandCommand } from '../../../common/models/cuaktask/GraphExpandCommand';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKind } from '../domain/TaskKind';
import { TaskKindType } from '../domain/TaskKindType';

export type CreateInstanceTaskGraphExpandCommand = GraphExpandCommand<
  TaskKindType.createInstance,
  Node<Task<CreateInstanceTaskKind>, Task<TaskKind>>
>;
