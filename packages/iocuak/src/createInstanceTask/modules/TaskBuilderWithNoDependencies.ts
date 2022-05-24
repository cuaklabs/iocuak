import * as cuaktask from '@cuaklabs/cuaktask';

import { ContainerRequestService } from '../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../container/services/domain/ContainerSingletonService';
import { CreateInstanceDependentTask } from '../models/cuaktask/CreateInstanceDependentTask';
import { GetInstanceDependenciesDependentTask } from '../models/cuaktask/GetInstanceDependenciesDependentTask';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { isTaskKind } from '../utils/isTaskKind';

export class TaskBuilderWithNoDependencies {
  #containerRequestService: ContainerRequestService;
  #containerSingletonService: ContainerSingletonService;

  constructor(
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
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
        case TaskKindType.createInstanceRoot:
          throw new Error('Invalid task kind');
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
  ): CreateInstanceDependentTask {
    return new CreateInstanceDependentTask(
      taskKind,
      this.#containerRequestService,
      this.#containerSingletonService,
    );
  }

  #buildGetInstanceDependenciesTaskWithNoDependencies(
    taskKind: GetInstanceDependenciesTaskKind,
  ): GetInstanceDependenciesDependentTask {
    return new GetInstanceDependenciesDependentTask(taskKind);
  }
}
