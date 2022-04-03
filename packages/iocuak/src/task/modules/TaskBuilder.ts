import {
  Builder,
  DependentTask,
  SafeDependentTaskBuilder,
  SetLike,
  TaskDependencyEngine,
} from '@cuaklabs/cuaktask';

import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { ContainerRequestService } from '../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../container/services/domain/ContainerSingletonService';
import { isTaskKind } from '../../utils/isTaskKind';
import { CreateInstanceTask } from '../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesTask } from '../models/cuaktask/GetInstanceDependenciesTask';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class TaskBuilder extends SafeDependentTaskBuilder<TaskKind> {
  #containerBindingService: ContainerBindingService;
  #containerRequestService: ContainerRequestService;
  #containerSingletonService: ContainerSingletonService;

  constructor(
    taskDependencyEngine: TaskDependencyEngine,
    taskDependenciesKindSetBuilder: Builder<SetLike<TaskKind>>,
    containerBindingService: ContainerBindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
    super(taskDependencyEngine, taskDependenciesKindSetBuilder);

    this.#containerBindingService = containerBindingService;
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
  }

  protected buildWithNoDependencies<TKind, TArgs extends unknown[], TReturn>(
    taskKind: TKind,
  ): DependentTask<TKind, unknown, TArgs, TReturn> {
    if (isTaskKind(taskKind)) {
      switch (taskKind.type) {
        case TaskKindType.createInstance:
          return this.#buildCreateInstanceTaskWithNoDependencies(
            taskKind,
          ) as unknown as DependentTask<TKind, unknown, TArgs, TReturn>;
        case TaskKindType.getInstanceDependencies:
          return this.#buildGetInstanceDependenciesTaskWithNoDependencies(
            taskKind,
          ) as unknown as DependentTask<TKind, unknown, TArgs, TReturn>;
      }
    } else {
      throw new Error('Task kind not supported');
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #buildCreateInstanceTaskWithNoDependencies(
    taskKind: CreateInstanceTaskKind,
  ): CreateInstanceTask {
    return new CreateInstanceTask(
      taskKind,
      this.#containerBindingService,
      this.#containerRequestService,
      this.#containerSingletonService,
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #buildGetInstanceDependenciesTaskWithNoDependencies(
    taskKind: GetInstanceDependenciesTaskKind,
  ): GetInstanceDependenciesTask {
    return new GetInstanceDependenciesTask(taskKind);
  }
}
