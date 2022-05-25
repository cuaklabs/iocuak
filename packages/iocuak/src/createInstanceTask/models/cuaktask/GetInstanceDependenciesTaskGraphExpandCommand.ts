import { Node, Task } from '@cuaklabs/cuaktask';

import { GraphExpandCommand } from '../../../common/models/cuaktask/GraphExpandCommand';
import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../domain/TaskKind';
import { TaskKindType } from '../domain/TaskKindType';

export type GetInstanceDependenciesTaskGraphExpandCommand = GraphExpandCommand<
  TaskKindType.getInstanceDependencies,
  Node<Task<GetInstanceDependenciesTaskKind>, Task<TaskKind>>
>;
