import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingService } from '../../binding/services/domain/BindingService';
import { Builder } from '../../common/modules/domain/Builder';
import { SetLike } from '../../common/modules/domain/SetLike';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { TaskKind } from '../models/domain/TaskKind';
import { CreateInstancesTaskDependenciesOperation } from './CreateInstancesTaskDependenciesOperation';

type TaskKindGraph = cuaktask.TaskDependencyKindGraph<TaskKind, TaskKind>;

export class CreateInstancesTaskDependencyEngine
  implements cuaktask.TaskDependencyEngine<TaskKind, TaskKind>
{
  readonly #containerBindingService: BindingService;
  readonly #metadataService: MetadataService;
  readonly #taskKindSerBuilder: Builder<SetLike<TaskKind>>;

  constructor(
    containerBindingService: BindingService,
    metadataService: MetadataService,
    taskKindSerBuilder: Builder<SetLike<TaskKind>>,
  ) {
    this.#containerBindingService = containerBindingService;
    this.#metadataService = metadataService;
    this.#taskKindSerBuilder = taskKindSerBuilder;
  }

  public getDependencies(taskKind: TaskKind): TaskKindGraph {
    const createInstancesTaskDependencyEngineOperation: CreateInstancesTaskDependenciesOperation =
      new CreateInstancesTaskDependenciesOperation(
        this.#containerBindingService,
        this.#metadataService,
        taskKind,
        this.#taskKindSerBuilder,
      );

    const taskKindGraph: TaskKindGraph =
      createInstancesTaskDependencyEngineOperation.run();

    return taskKindGraph;
  }
}
