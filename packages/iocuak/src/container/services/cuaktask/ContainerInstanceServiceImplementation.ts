import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { CreateInstanceRootTaskKind } from '../../../createInstanceTask/models/domain/CreateInstanceRootTaskKind';
import { TaskKind } from '../../../createInstanceTask/models/domain/TaskKind';
import { TaskKindType } from '../../../createInstanceTask/models/domain/TaskKindType';
import { ContainerInstanceService } from '../domain/ContainerInstanceService';
import { ContainerRequestService } from '../domain/ContainerRequestService';

export class ContainerInstanceServiceImplementation
  implements ContainerInstanceService
{
  readonly #containerRequestService: ContainerRequestService;
  readonly #rootedTaskGraphRunner: cuaktask.RootedTaskGraphRunner;
  readonly #taskGraphEngine: cuaktask.TaskGraphEngine<TaskKind>;

  constructor(
    containerRequestService: ContainerRequestService,
    rootedTaskGraphRunner: cuaktask.RootedTaskGraphRunner,
    taskGraphEngine: cuaktask.TaskGraphEngine<TaskKind>,
  ) {
    this.#containerRequestService = containerRequestService;
    this.#rootedTaskGraphRunner = rootedTaskGraphRunner;
    this.#taskGraphEngine = taskGraphEngine;
  }

  public create<TInstance>(serviceId: ServiceId): TInstance {
    const requestId: symbol = this.#containerRequestService.start();

    const taskKind: CreateInstanceRootTaskKind = {
      id: serviceId,
      requestId: requestId,
      type: TaskKindType.createInstanceRoot,
    };

    const taskGraph: cuaktask.RootedGraph<cuaktask.Task<TaskKind>> =
      this.#taskGraphEngine.create(taskKind);

    const instance: TInstance = this.#rootedTaskGraphRunner.run(
      taskGraph,
    ) as TInstance;

    this.#containerRequestService.end(requestId);

    return instance;
  }
}
