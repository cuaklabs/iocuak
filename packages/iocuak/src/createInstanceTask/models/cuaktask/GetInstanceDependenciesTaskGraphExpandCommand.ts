import { Task } from '@cuaklabs/cuaktask';

import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { BaseTaskGraphExpandCommand } from './BaseTaskGraphExpandCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from './CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommandType } from './TaskGraphExpandCommandType';

export type GetInstanceDependenciesTaskGraphExpandCommand =
  BaseTaskGraphExpandCommand<
    CreateInstanceTaskGraphExpandOperationContext,
    TaskGraphExpandCommandType.getInstanceDependencies,
    Task<GetInstanceDependenciesTaskKind>
  >;
