import { Builder } from '../../common/modules/Builder';
import { SetLike } from '../../common/modules/SetLike';
import { DependentTask } from '../models/domain/DependentTask';
import { DependentTaskBuildOperation } from './DependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

export class SafeDependentTaskBuildOperation<
  TKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> extends DependentTaskBuildOperation<TKind, TArgs, TReturn> {
  readonly #taskDependenciesKindSet: SetLike<TKind>;

  constructor(
    taskWithNoDependenciesBuilder: Builder<
      DependentTask<TKind, unknown, TArgs, TReturn>,
      [TKind]
    >,
    taskDependencyEngine: TaskDependencyEngine,
    taskDependenciesKindSet: SetLike<TKind>,
  ) {
    super(taskWithNoDependenciesBuilder, taskDependencyEngine);

    this.#taskDependenciesKindSet = taskDependenciesKindSet;
  }

  protected override build(
    taskKind: TKind,
  ): DependentTask<TKind, TKind, TArgs, TReturn> {
    if (this.#taskDependenciesKindSet.has(taskKind)) {
      throw new Error('Circular dependency found!');
    }

    const task: DependentTask<TKind, unknown, TArgs, TReturn> = super.build(
      taskKind,
    );

    return task;
  }

  protected override buildDependencies(
    taskKind: TKind,
  ): DependentTask<TKind>[] {
    this.#taskDependenciesKindSet.add(taskKind);

    const taskDependencies: DependentTask<TKind>[] = super.buildDependencies(
      taskKind,
    );

    this.#taskDependenciesKindSet.delete(taskKind);

    return taskDependencies;
  }
}
