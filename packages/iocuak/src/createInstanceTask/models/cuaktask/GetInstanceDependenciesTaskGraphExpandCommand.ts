import { Task } from '@cuaklabs/cuaktask';

import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommandBase } from './TaskGraphExpandCommandBase';

export type GetInstanceDependenciesTaskGraphExpandCommand =
  TaskGraphExpandCommandBase<
    CreateInstanceTaskGraphExpandOperationContext,
    TaskKindType.getInstanceDependencies,
    Task<GetInstanceDependenciesTaskKind>
  >;
