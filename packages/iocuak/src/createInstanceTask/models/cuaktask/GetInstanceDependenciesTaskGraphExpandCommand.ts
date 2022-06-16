import { Task } from '@cuaklabs/cuaktask';

import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommand } from './TaskGraphExpandCommand';

export type GetInstanceDependenciesTaskGraphExpandCommand =
  TaskGraphExpandCommand<
    CreateInstanceTaskGraphExpandOperationContext,
    TaskKindType.getInstanceDependencies,
    Task<GetInstanceDependenciesTaskKind>
  >;
