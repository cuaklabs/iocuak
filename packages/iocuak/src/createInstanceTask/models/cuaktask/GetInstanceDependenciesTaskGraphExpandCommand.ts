import { Task } from '@cuaklabs/cuaktask';

import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommandBase } from './TaskGraphExpandCommandBase';
import { TaskGraphExpandCommandType } from './TaskGraphExpandCommandType';

export type GetInstanceDependenciesTaskGraphExpandCommand =
  TaskGraphExpandCommandBase<
    CreateInstanceTaskGraphExpandOperationContext,
    TaskGraphExpandCommandType.getInstanceDependencies,
    Task<GetInstanceDependenciesTaskKind>
  >;
