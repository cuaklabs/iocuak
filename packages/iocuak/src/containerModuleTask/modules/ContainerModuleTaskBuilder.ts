import {
  DependentTask,
  DependentTaskBuilder,
  TaskDependencyEngine,
} from '@cuaklabs/cuaktask';

import { ContainerModuleTaskKind } from '../models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskBuilderWithNoDependencies } from './ContainerModuleTaskBuilderWithNoDependencies';

export class ContainerModuleTaskBuilder extends DependentTaskBuilder<ContainerModuleTaskKind> {
  #taskBuilderWithNoDependencies: ContainerModuleTaskBuilderWithNoDependencies;

  constructor(
    taskDependencyEngine: TaskDependencyEngine<ContainerModuleTaskKind>,
    taskBuilderWithNoDependencies: ContainerModuleTaskBuilderWithNoDependencies,
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
