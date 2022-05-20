import {
  DependentTask,
  DependentTaskBuilder,
  TaskDependencyEngine,
} from '@cuaklabs/cuaktask';

import { TaskKind } from '../models/domain/TaskKind';
import { TaskBuilderWithNoDependencies } from './TaskBuilderWithNoDependencies';

export class TaskBuilder extends DependentTaskBuilder<TaskKind> {
  #taskBuilderWithNoDependencies: TaskBuilderWithNoDependencies;

  constructor(
    taskDependencyEngine: TaskDependencyEngine<TaskKind>,
    taskBuilderWithNoDependencies: TaskBuilderWithNoDependencies,
  ) {
    super(taskDependencyEngine);

    this.#taskBuilderWithNoDependencies = taskBuilderWithNoDependencies;
  }

  protected buildWithNoDependencies<TKind, TArgs extends unknown[], TReturn>(
    taskKind: TKind,
  ): DependentTask<TKind, unknown, TArgs, TReturn> {
    return this.#taskBuilderWithNoDependencies.buildWithNoDependencies(
      taskKind,
    );
  }
}
