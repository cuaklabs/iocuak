import { Builder } from '../../common/modules/Builder';
import { DependentTask } from '../models/domain/DependentTask';
import { DependentTaskBuildOperation } from './DependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

export abstract class DependentTaskBuilder<
  TKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> implements Builder<DependentTask<TKind, TKind, TArgs, TReturn>, [TKind]>
{
  protected readonly taskWithNoDependenciesBuilder: Builder<
    DependentTask<TKind, unknown, TArgs, TReturn>,
    [TKind]
  >;
  protected readonly taskDependencyEngine: TaskDependencyEngine;

  constructor(taskDependencyEngine: TaskDependencyEngine) {
    this.taskWithNoDependenciesBuilder = {
      build: this.buildWithNoDependencies.bind(this),
    };
    this.taskDependencyEngine = taskDependencyEngine;
  }

  /**
   * Builds a task.
   * @param taskKind Task kind of the task to build
   * @returns Task built.
   */
  public build(taskKind: TKind): DependentTask<TKind, TKind, TArgs, TReturn> {
    const dependentTaskBuildOperation: DependentTaskBuildOperation<
      TKind,
      TArgs,
      TReturn
    > = this.buildDependentTaskBuildOperation();

    const dependentTask: DependentTask<TKind, TKind, TArgs, TReturn> =
      dependentTaskBuildOperation.run(taskKind);

    return dependentTask;
  }

  protected buildDependentTaskBuildOperation(): DependentTaskBuildOperation<
    TKind,
    TArgs,
    TReturn
  > {
    const dependentTaskBuildOperation: DependentTaskBuildOperation<
      TKind,
      TArgs,
      TReturn
    > = new DependentTaskBuildOperation(
      this.taskWithNoDependenciesBuilder,
      this.taskDependencyEngine,
    );

    return dependentTaskBuildOperation;
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
}
