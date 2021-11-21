import {
  Builder,
  DependentTask,
  DependentTaskRunner,
} from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { CreateInstanceTask } from '../../../task/models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskKind } from '../../../task/models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { TaskKindType } from '../../../task/models/domain/TaskKindType';
import { ContainerInstanceService } from '../domain/ContainerInstanceService';
import { ContainerRequestService } from '../domain/ContainerRequestService';

export class ContainerInstanceServiceImplementation
  implements ContainerInstanceService
{
  readonly #containerRequestService: ContainerRequestService;

  readonly #dependentTaskRunner: DependentTaskRunner;

  readonly #taskBuilder: Builder<[TaskKind], DependentTask<TaskKind, TaskKind>>;

  constructor(
    containerRequestService: ContainerRequestService,
    dependentTaskRunner: DependentTaskRunner,
    taskBuilder: Builder<[TaskKind], DependentTask<TaskKind, TaskKind>>,
  ) {
    this.#containerRequestService = containerRequestService;
    this.#dependentTaskRunner = dependentTaskRunner;
    this.#taskBuilder = taskBuilder;
  }

  public create<TInstance>(serviceId: ServiceId): TInstance {
    const requestId: symbol = this.#containerRequestService.start();

    const taskKind: CreateInstanceTaskKind = {
      id: serviceId,
      requestId: requestId,
      type: TaskKindType.createInstance,
    };

    const createInstanceTask: CreateInstanceTask = this.#taskBuilder.build(
      taskKind,
    ) as CreateInstanceTask;

    this.#containerRequestService.end(requestId);

    const instance: TInstance = this.#dependentTaskRunner.run(
      createInstanceTask,
    ) as TInstance;

    return instance;
  }
}
