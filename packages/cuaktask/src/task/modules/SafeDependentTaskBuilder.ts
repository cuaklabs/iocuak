import { Builder } from '../../common/modules/Builder';
import { SetLike } from '../../common/modules/SetLike';
import { DependentTaskBuilder } from './DependentTaskBuilder';
import { DependentTaskBuildOperation } from './DependentTaskBuildOperation';
import { SafeDependentTaskBuildOperation } from './SafeDependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

export abstract class SafeDependentTaskBuilder<
  TKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> extends DependentTaskBuilder<TKind, TArgs, TReturn> {
  readonly #taskDependenciesKindSetBuilder: Builder<SetLike<TKind>>;

  constructor(
    taskDependencyEngine: TaskDependencyEngine,
    taskDependenciesKindSetBuilder: Builder<SetLike<TKind>>,
  ) {
    super(taskDependencyEngine);

    this.#taskDependenciesKindSetBuilder = taskDependenciesKindSetBuilder;
  }

  protected override buildDependentTaskBuildOperation(): DependentTaskBuildOperation<
    TKind,
    TArgs,
    TReturn
  > {
    const taskDependenciesKindSet: SetLike<TKind> =
      this.#taskDependenciesKindSetBuilder.build();

    const dependentTaskBuildOperation: DependentTaskBuildOperation<
      TKind,
      TArgs,
      TReturn
    > = new SafeDependentTaskBuildOperation(
      this.taskWithNoDependenciesBuilder,
      this.taskDependencyEngine,
      taskDependenciesKindSet,
    );

    return dependentTaskBuildOperation;
  }
}
