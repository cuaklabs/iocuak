import {
  DependentTaskBuilder,
  SetLike,
  TaskDependencyEngine,
} from '@cuaklabs/cuaktask';

import { Builder } from '../../../cuaktask/common/modules/Builder';
import { DependentTask } from '../../../cuaktask/task/models/domain/DependentTask';
import { Binding } from '../../binding/models/domain/Binding';
import { ContainerInternalService } from '../../container/services/ContainerInternalService';
import { isTaskKind } from '../../utils/isTaskKind';
import { stringifyTaskId } from '../../utils/stringifyTaskId';
import { CreateInstanceTask } from '../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesTask } from '../models/cuaktask/GetInstanceDependenciesTask';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class TaskBuilder extends DependentTaskBuilder<TaskKind, TaskKind> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #containerInternalService: ContainerInternalService;

  constructor(
    taskDependenciesKindSetBuilder: Builder<[], SetLike<TaskKind>>,
    taskDependencyEngine: TaskDependencyEngine,
    containerInternalService: ContainerInternalService,
  ) {
    super(taskDependenciesKindSetBuilder, taskDependencyEngine);

    this.#containerInternalService = containerInternalService;
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
    const binding: Binding | undefined =
      this.#containerInternalService.binding.get(taskKind.id);

    if (binding === undefined) {
      throw new Error(
        `No bindings found for type ${stringifyTaskId(taskKind.id)}`,
      );
    } else {
      return new CreateInstanceTask(
        binding.type,
        this.#containerInternalService,
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
