import {
  Builder,
  DependentTask,
  DependentTaskRunner,
} from '@cuaklabs/cuaktask';

import { CreateInstanceTask } from '../../../task/models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskKind } from '../../../task/models/domain/CreateInstanceTaskKind';
import { ServiceId } from '../../../task/models/domain/ServiceId';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { TaskKindType } from '../../../task/models/domain/TaskKindType';
import { ContainerInstanceService } from '../domain/ContainerInstanceService';

export class ContainerInstanceServiceImplementation
  implements ContainerInstanceService
{
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #dependentTaskRunner: DependentTaskRunner;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #taskBuilder: Builder<[TaskKind], DependentTask<TaskKind, TaskKind>>;

  constructor(
    dependentTaskRunner: DependentTaskRunner,
    taskBuilder: Builder<[TaskKind], DependentTask<TaskKind, TaskKind>>,
  ) {
    this.#dependentTaskRunner = dependentTaskRunner;
    this.#taskBuilder = taskBuilder;
  }

  public create<TInstance>(serviceId: ServiceId): TInstance {
    const taskKind: CreateInstanceTaskKind = {
      id: serviceId,
      type: TaskKindType.createInstance,
    };

    const createInstanceTask: CreateInstanceTask = this.#taskBuilder.build(
      taskKind,
    ) as CreateInstanceTask;

    const instance: TInstance = this.#dependentTaskRunner.run(
      createInstanceTask,
    ) as TInstance;

    return instance;
  }
}
