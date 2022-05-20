import { DependentTask, DependentTaskRunner } from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Builder } from '../../../common/modules/domain/Builder';
import { CreateInstanceTask } from '../../../createInstanceTask/models/cuaktask/CreateInstanceTask';
import { CreateInstanceRootTaskKind } from '../../../createInstanceTask/models/domain/CreateInstanceRootTaskKind';
import { TaskKind } from '../../../createInstanceTask/models/domain/TaskKind';
import { TaskKindType } from '../../../createInstanceTask/models/domain/TaskKindType';
import { ContainerInstanceService } from '../domain/ContainerInstanceService';
import { ContainerRequestService } from '../domain/ContainerRequestService';

export class ContainerInstanceServiceImplementation
  implements ContainerInstanceService
{
  readonly #containerRequestService: ContainerRequestService;
  readonly #dependentTaskRunner: DependentTaskRunner;
  readonly #taskBuilder: Builder<DependentTask<TaskKind, TaskKind>, [TaskKind]>;

  constructor(
    containerRequestService: ContainerRequestService,
    dependentTaskRunner: DependentTaskRunner,
    taskBuilder: Builder<DependentTask<TaskKind, TaskKind>, [TaskKind]>,
  ) {
    this.#containerRequestService = containerRequestService;
    this.#dependentTaskRunner = dependentTaskRunner;
    this.#taskBuilder = taskBuilder;
  }

  public create<TInstance>(serviceId: ServiceId): TInstance {
    const requestId: symbol = this.#containerRequestService.start();

    const taskKind: CreateInstanceRootTaskKind = {
      id: serviceId,
      requestId: requestId,
      type: TaskKindType.createInstanceRoot,
    };

    const createInstanceTask: CreateInstanceTask<TInstance> =
      this.#taskBuilder.build(taskKind) as CreateInstanceTask<TInstance>;

    const instance: TInstance = this.#dependentTaskRunner.run(
      createInstanceTask,
    ) as TInstance;

    this.#containerRequestService.end(requestId);

    return instance;
  }
}
