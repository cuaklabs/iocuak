import { FlatPromise } from '../../common/models/FlatPromise';
import { MayBePromise } from '../../common/models/MayBePromise';
import { NonThenableProperties } from '../../common/models/NonThenableProperties';
import { PromiseIfThenable } from '../../common/models/PromiseIfThenable';
import { isPromiseLike } from '../../common/utils/domain/isPromiseLike';
import { DependentTask } from '../models/domain/DependentTask';
import { ExpandedDependentTask } from '../models/domain/ExpandedDependentTask';
import { TaskStatus } from '../models/domain/TaskStatus';

export class DependentTaskRunner {
  /**
   * Performs a task execution.
   * @param dependenTask dependent task to run.
   * @returns Result of the task execution. It may be encapsulated into a Promise if a
   * dependent task execution is asyncronous.
   */
  public run<TKind, TDependencyKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn>,
  ): MayBePromise<TReturn> {
    return this.#innerRun(dependenTask);
  }

  #castToExpandedDependentTask<
    TKind,
    TDependencyKind,
    TArgs extends unknown[],
    TReturn,
  >(
    dependenTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn>,
  ): ExpandedDependentTask<TKind, TDependencyKind, TArgs, TReturn> {
    return dependenTask as ExpandedDependentTask<
      TKind,
      TDependencyKind,
      TArgs,
      TReturn
    >;
  }

  #innerRun<TKind, TDependencyKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn>,
  ): MayBePromise<TReturn> {
    if (dependenTask.status === TaskStatus.NotStarted) {
      const dependenciesRunResults: unknown[] = dependenTask.dependencies.map(
        this.#innerRun.bind(this),
      );

      let result: MayBePromise<TReturn>;

      if (dependenciesRunResults.some(isPromiseLike)) {
        result = this.#innerRunDependenciesAsync(
          this.#castToExpandedDependentTask(dependenTask),
          dependenciesRunResults,
        ) as MayBePromise<TReturn>;
      } else {
        result = this.#innerRunTask(
          this.#castToExpandedDependentTask(dependenTask),
          dependenciesRunResults as NonThenableProperties<TArgs>,
        );
      }

      return result;
    } else {
      return dependenTask.result as MayBePromise<TReturn>;
    }
  }

  async #innerRunDependenciesAsync<
    TKind,
    TDependencyKind,
    TArgs extends unknown[],
    TReturn,
  >(
    dependenTask: ExpandedDependentTask<TKind, TDependencyKind, TArgs, TReturn>,
    dependenciesRunResults: unknown[],
  ): FlatPromise<TReturn> {
    const dependenciesRunResultsResolved: unknown[] = await Promise.all(
      dependenciesRunResults,
    );

    const result: MayBePromise<TReturn> = this.#innerRunTask(
      dependenTask,
      dependenciesRunResultsResolved as NonThenableProperties<TArgs>,
    );

    return result as FlatPromise<TReturn>;
  }

  #innerRunTask<TKind, TDependencyKind, TArgs extends unknown[], TReturn>(
    dependenTask: ExpandedDependentTask<TKind, TDependencyKind, TArgs, TReturn>,
    dependenciesRunResults: NonThenableProperties<TArgs>,
  ): MayBePromise<TReturn> {
    const taskResult: PromiseIfThenable<TReturn> = dependenTask.perform(
      ...dependenciesRunResults,
    );

    return taskResult;
  }
}
