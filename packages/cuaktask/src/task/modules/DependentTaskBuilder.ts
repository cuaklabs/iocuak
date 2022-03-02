import { Builder } from '../../common/modules/Builder';
import { SetLike } from '../../common/modules/SetLike';
import { DependentTask } from '../models/domain/DependentTask';
import { TaskDependencyEngine } from './TaskDependencyEngine';

export abstract class DependentTaskBuilder<
  TKind = unknown,
  TDependencyKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> implements
    Builder<DependentTask<TKind, TDependencyKind, TArgs, TReturn>, [TKind]>
{
  readonly #taskDependenciesKindSetBuilder: Builder<
    SetLike<TKind | TDependencyKind>
  >;
  readonly #taskDependencyEngine: TaskDependencyEngine;

  constructor(
    taskDependenciesKindSetBuilder: Builder<SetLike<TKind>>,
    taskDependencyEngine: TaskDependencyEngine,
  ) {
    this.#taskDependenciesKindSetBuilder = taskDependenciesKindSetBuilder;
    this.#taskDependencyEngine = taskDependencyEngine;
  }

  /**
   * Builds a task.
   * @param taskKind Task kind of the task to build
   * @returns Task built.
   */
  public build(
    taskKind: TKind,
  ): DependentTask<TKind, TDependencyKind, TArgs, TReturn> {
    const taskDependenciesKindSet: SetLike<TKind | TDependencyKind> =
      this.#taskDependenciesKindSetBuilder.build();

    const dependentTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn> =
      this.#innerbuild(taskKind, taskDependenciesKindSet);

    return dependentTask;
  }

  /**
   * Builds a task with no dependencies.
   * @param taskKind Task kind of the task to build
   * @returns Task built.
   */
  protected abstract buildWithNoDependencies<
    TKind,
    TArgs extends unknown[],
    TReturn,
  >(taskKind: TKind): DependentTask<TKind, unknown, TArgs, TReturn>;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #innerbuild<TKind, TDependencyKind, TArgs extends unknown[], TReturn>(
    taskKind: TKind,
    taskDependenciesKindSet: SetLike<TKind | TDependencyKind>,
  ): DependentTask<TKind, TDependencyKind, TArgs, TReturn> {
    if (taskDependenciesKindSet.has(taskKind)) {
      throw new Error('Circular dependency found!');
    }

    const task: DependentTask<TKind, unknown, TArgs, TReturn> =
      this.buildWithNoDependencies(taskKind);

    taskDependenciesKindSet.add(taskKind);

    const taskDependenciesKind: TDependencyKind[] =
      this.#taskDependencyEngine.getDependencies(task.kind);

    const taskDependencies: DependentTask<
      TDependencyKind,
      unknown,
      unknown[],
      unknown
    >[] = taskDependenciesKind.map((taskDependencyKind: TDependencyKind) =>
      this.#innerbuild(taskDependencyKind, taskDependenciesKindSet),
    );

    taskDependenciesKindSet.delete(taskKind);

    task.dependencies.push(...taskDependencies);

    return task;
  }
}
