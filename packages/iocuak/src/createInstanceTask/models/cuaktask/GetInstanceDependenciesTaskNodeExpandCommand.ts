import { Task } from '@cuaklabs/cuaktask';

import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { BaseTaskNodeExpandCommand } from './BaseTaskNodeExpandCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from './CreateInstanceTaskNodeExpandOperationContext';
import { TaskNodeExpandCommandType } from './TaskNodeExpandCommandType';

export type GetInstanceDependenciesTaskNodeExpandCommand =
  BaseTaskNodeExpandCommand<
    CreateInstanceTaskNodeExpandOperationContext,
    TaskNodeExpandCommandType.getInstanceDependencies,
    Task<GetInstanceDependenciesTaskKind>
  >;
