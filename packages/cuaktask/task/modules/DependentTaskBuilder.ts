import { Builder } from '../../common/modules/Builder';
import { SetLike } from '../../common/modules/SetLike';
import { DependentTask } from '../models/domain/DependentTask';
import { Task } from '../models/domain/Task';
import { TaskDependencyEngine } from './TaskDependencyEngine';

export abstract class DependentTaskBuilder<
  TKind,
  TArgs extends unknown[],
  TReturn,
> implements Builder<[TKind], DependentTask<TKind, TArgs, TReturn>>
{
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #taskDependenciesKindSetBuilder: Builder<[], SetLike<TKind>>;
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #taskDependencyEngine: TaskDependencyEngine<TKind>;

  constructor(
    taskDependenciesKindSetBuilder: Builder<[], SetLike<TKind>>,
    taskDependencyEngine: TaskDependencyEngine<TKind>,
  ) {
    this.#taskDependenciesKindSetBuilder = taskDependenciesKindSetBuilder;
    this.#taskDependencyEngine = taskDependencyEngine;
  }

  public build(taskKind: TKind): DependentTask<TKind, TArgs, TReturn> {
    const taskDependenciesKindSet: SetLike<TKind> =
      this.#taskDependenciesKindSetBuilder.build();

    const dependentTask: DependentTask<TKind, TArgs, TReturn> =
      this.#innerbuild(taskKind, taskDependenciesKindSet);

    return dependentTask;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #innerbuild<TArgs extends unknown[], TReturn>(
    taskKind: TKind,
    taskDependenciesKindSet: SetLike<TKind>,
  ): DependentTask<TKind, TArgs, TReturn> {
    if (taskDependenciesKindSet.has(taskKind)) {
      throw new Error('Circular dependency found!');
    }

    const task: Task<TKind, TArgs, TReturn> =
      this.buildWithNoDependencies(taskKind);

    taskDependenciesKindSet.add(taskKind);

    const taskDependenciesKind: TKind[] =
      this.#taskDependencyEngine.getDependencies(task.kind);

    const taskDependencies: DependentTask<TKind, unknown[], unknown>[] =
      taskDependenciesKind.map((taskDependencyKind: TKind) =>
        this.#innerbuild(taskDependencyKind, taskDependenciesKindSet),
      );

    taskDependenciesKindSet.delete(taskKind);

    const dependentTask: DependentTask<TKind, TArgs, TReturn> = {
      dependencies: taskDependencies,
      ...task,
    };

    return dependentTask;
  }

  protected abstract buildWithNoDependencies<TArgs extends unknown[], TReturn>(
    taskKind: TKind,
  ): Task<TKind, TArgs, TReturn>;
}
