import { Task } from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';

export type GetInstanceDependenciesTaskGraphExpandCommand =
  TaskGraphExpandCommand<
    CreateInstanceTaskGraphExpandOperationContext,
    TaskKindType.getInstanceDependencies,
    Task<GetInstanceDependenciesTaskKind>
  >;
