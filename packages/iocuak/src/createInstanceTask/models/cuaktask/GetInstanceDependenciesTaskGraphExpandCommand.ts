import { Task } from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../domain/TaskKindType';

export type GetInstanceDependenciesTaskGraphExpandCommand =
  TaskGraphExpandCommand<
    TaskKindType.getInstanceDependencies,
    Task<GetInstanceDependenciesTaskKind>
  >;
