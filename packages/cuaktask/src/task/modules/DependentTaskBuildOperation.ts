import { Builder } from '../../common/modules/Builder';
import { DependentTask } from '../models/domain/DependentTask';
import { TaskDependencyEngine } from './TaskDependencyEngine';

export class DependentTaskBuildOperation<
  TKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> {
  readonly #taskWithNoDependenciesBuilder: Builder<
    DependentTask<TKind, unknown, TArgs, TReturn>,
    [TKind]
  >;
  readonly #taskDependencyEngine: TaskDependencyEngine;

  constructor(
    taskWithNoDependenciesBuilder: Builder<
      DependentTask<TKind, unknown, TArgs, TReturn>,
      [TKind]
    >,
    taskDependencyEngine: TaskDependencyEngine,
  ) {
    this.#taskWithNoDependenciesBuilder = taskWithNoDependenciesBuilder;
    this.#taskDependencyEngine = taskDependencyEngine;
  }

  /**
   * Builds a task.
   * @param taskKind Task kind of the task to build
   * @returns Task built.
   */
  public run(taskKind: TKind): DependentTask<TKind, TKind, TArgs, TReturn> {
    const dependentTask: DependentTask<TKind, TKind, TArgs, TReturn> =
      this.build(taskKind);

    return dependentTask;
  }

  protected build(
    taskKind: TKind,
  ): DependentTask<TKind, TKind, TArgs, TReturn> {
    const task: DependentTask<TKind, unknown, TArgs, TReturn> =
      this.#taskWithNoDependenciesBuilder.build(taskKind);

    const taskDependencies: DependentTask<TKind>[] = this.buildDependencies(
      task.kind,
    );

    task.dependencies.push(...taskDependencies);

    return task;
  }

  protected buildDependencies(taskKind: TKind): DependentTask<TKind>[] {
    const taskDependenciesKind: TKind[] =
      this.#taskDependencyEngine.getDependencies(taskKind);

    const taskDependencies: DependentTask<TKind>[] = taskDependenciesKind.map(
      (taskDependencyKind: TKind) => this.build(taskDependencyKind),
    );

    return taskDependencies;
  }
}
