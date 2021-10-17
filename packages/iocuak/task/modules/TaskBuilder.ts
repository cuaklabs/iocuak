import {
  DependentTaskBuilder,
  SetLike,
  TaskDependencyEngine,
} from '@cuaklabs/cuaktask';

import { Builder } from '../../../cuaktask/common/modules/Builder';
import { DependentTask } from '../../../cuaktask/task/models/domain/DependentTask';
import { Binding } from '../../binding/models/domain/Binding';
import { ContainerService } from '../../container/services/domain/ContainerService';
import { isTaskKind } from '../../utils/isTaskKind';
import { stringifyServiceId } from '../../utils/stringifyServiceId';
import { CreateInstanceTask } from '../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesTask } from '../models/cuaktask/GetInstanceDependenciesTask';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class TaskBuilder extends DependentTaskBuilder<TaskKind, TaskKind> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #containerService: ContainerService;

  constructor(
    taskDependenciesKindSetBuilder: Builder<[], SetLike<TaskKind>>,
    taskDependencyEngine: TaskDependencyEngine,
    containerService: ContainerService,
  ) {
    super(taskDependenciesKindSetBuilder, taskDependencyEngine);

    this.#containerService = containerService;
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

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/member-ordering
  #buildCreateInstanceTaskWithNoDependencies(
    taskKind: CreateInstanceTaskKind,
  ): CreateInstanceTask {
    const binding: Binding | undefined = this.#containerService.binding.get(
      taskKind.id,
    );

    if (binding === undefined) {
      throw new Error(
        `No bindings found for type ${stringifyServiceId(taskKind.id)}`,
      );
    } else {
      return new CreateInstanceTask(
        binding.type,
        this.#containerService,
        taskKind,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/member-ordering
  #buildGetInstanceDependenciesTaskWithNoDependencies(
    taskKind: GetInstanceDependenciesTaskKind,
  ): GetInstanceDependenciesTask {
    return new GetInstanceDependenciesTask(taskKind);
  }
}
