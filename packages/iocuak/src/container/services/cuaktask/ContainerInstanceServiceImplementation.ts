import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { CreateInstanceRootTaskKind } from '../../../createInstanceTask/models/domain/CreateInstanceRootTaskKind';
import { CreateTagInstancesRootTaskKind } from '../../../createInstanceTask/models/domain/CreateTagInstancesRootTaskKind';
import { TaskKind } from '../../../createInstanceTask/models/domain/TaskKind';
import { TaskKindType } from '../../../createInstanceTask/models/domain/TaskKindType';
import { BindingTag } from '../../../index';
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
    const instance: TInstance = this.#innerCreate(
      serviceId,
      (
        serviceId: ServiceId,
        requestId: symbol,
      ): CreateInstanceRootTaskKind => ({
        id: serviceId,
        requestId: requestId,
        type: TaskKindType.createInstanceRoot,
      }),
    );

    return instance;
  }

  public createByTag<TInstances extends unknown[] = unknown[]>(
    tag: BindingTag,
  ): TInstances {
    const instances: TInstances = this.#innerCreate(
      tag,
      (tag: BindingTag, requestId: symbol): CreateTagInstancesRootTaskKind => ({
        requestId: requestId,
        tag,
        type: TaskKindType.createTagInstancesRoot,
      }),
    );

    return instances;
  }

  #innerCreate<TInput, TOutput>(
    input: TInput,
    inputToTaskKind: (input: TInput, requestId: symbol) => TaskKind,
  ): TOutput {
    const requestId: symbol = this.#containerRequestService.start();

    const taskKind: TaskKind = inputToTaskKind(input, requestId);

    const taskGraph: cuaktask.RootedGraph<cuaktask.Task<TaskKind>> =
      this.#taskGraphEngine.create(taskKind);

    const output: TOutput = this.#rootedTaskGraphRunner.run(
      taskGraph,
    ) as TOutput;

    this.#containerRequestService.end(requestId);

    return output;
  }
}
