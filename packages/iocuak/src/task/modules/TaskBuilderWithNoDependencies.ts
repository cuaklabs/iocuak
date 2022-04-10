import * as cuaktask from '@cuaklabs/cuaktask';

import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { ContainerRequestService } from '../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../container/services/domain/ContainerSingletonService';
import { isTaskKind } from '../../utils/isTaskKind';
import { CreateInstanceTask } from '../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesTask } from '../models/cuaktask/GetInstanceDependenciesTask';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class TaskBuilderWithNoDependencies {
  #containerBindingService: ContainerBindingService;
  #containerRequestService: ContainerRequestService;
  #containerSingletonService: ContainerSingletonService;

  constructor(
    containerBindingService: ContainerBindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
    this.#containerBindingService = containerBindingService;
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
  }

  public buildWithNoDependencies<TKind, TArgs extends unknown[], TReturn>(
    taskKind: TKind,
  ): cuaktask.DependentTask<TKind, unknown, TArgs, TReturn> {
    if (isTaskKind(taskKind)) {
      switch (taskKind.type) {
        case TaskKindType.createInstance:
          return this.#buildCreateInstanceTaskWithNoDependencies(
            taskKind,
          ) as unknown as cuaktask.DependentTask<
            TKind,
            unknown,
            TArgs,
            TReturn
          >;
        case TaskKindType.getInstanceDependencies:
          return this.#buildGetInstanceDependenciesTaskWithNoDependencies(
            taskKind,
          ) as unknown as cuaktask.DependentTask<
            TKind,
            unknown,
            TArgs,
            TReturn
          >;
      }
    } else {
      throw new Error('Task kind not supported');
    }
  }

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

  #buildGetInstanceDependenciesTaskWithNoDependencies(
    taskKind: GetInstanceDependenciesTaskKind,
  ): GetInstanceDependenciesTask {
    return new GetInstanceDependenciesTask(taskKind);
  }
}
