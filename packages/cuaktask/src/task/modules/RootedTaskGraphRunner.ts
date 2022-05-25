import { MayBePromise } from '../../common/models/MayBePromise';
import { NonThenableProperties } from '../../common/models/NonThenableProperties';
import { isPromiseLike } from '../../common/utils/domain/isPromiseLike';
import { mapIterable } from '../../common/utils/domain/mapIterable';
import { AndNodeDependencies } from '../../graph/models/domain/AndNodeDependencies';
import { BitwiseOrNodeDependencies } from '../../graph/models/domain/BitwiseOrNodeDependencies';
import { Node } from '../../graph/models/domain/Node';
import { NodeDependencies } from '../../graph/models/domain/NodeDependencies';
import { NodeDependenciesType } from '../../graph/models/domain/NodeDependenciesType';
import { NodeDependency } from '../../graph/models/domain/NodeDependency';
import { RootedGraph } from '../../graph/models/domain/RootedGraph';
import { ExpandedTask } from '../models/domain/ExpandedTask';
import { Task } from '../models/domain/Task';
import { TaskStatus } from '../models/domain/TaskStatus';

type UnknownExpandedTask<TKind> = ExpandedTask<TKind, unknown[], unknown>;
type UnknownExpandedTaskNode<TKind> = Node<UnknownExpandedTask<TKind>>;
type UnknownExpandedTaskNodeDependency<TKind> = NodeDependency<
  UnknownExpandedTask<TKind>
>;

type OperationResult<TValue = unknown> = SucessResult<TValue> | FailResult;

type FailResult = BaseOperationResult<false>;

interface SucessResult<TValue = unknown> extends BaseOperationResult<true> {
  value: TValue;
}

interface BaseOperationResult<TSuccess extends boolean = boolean> {
  success: TSuccess;
}

export class RootedTaskGraphRunner {
  public run<TKind, TReturn>(
    graph: RootedGraph<Task<TKind>>,
  ): MayBePromise<TReturn> {
    const result: MayBePromise<OperationResult> = this.#innerRun(
      graph.root as UnknownExpandedTaskNode<TKind>,
    );

    if (isPromiseLike(result)) {
      return this.#runResultAsync(result) as MayBePromise<TReturn>;
    } else {
      return this.#runResult(result);
    }
  }

  #dependenciesRunResultToNodeTaskOperationResult<TKind>(
    node: UnknownExpandedTaskNode<TKind>,
    dependenciesResult: OperationResult<unknown[]>,
  ): MayBePromise<OperationResult> {
    let result: MayBePromise<OperationResult>;

    if (dependenciesResult.success) {
      result = this.#innerRunTask(node.element, dependenciesResult.value);
    } else {
      result = dependenciesResult;
    }

    return result;
  }

  #innerRun<TKind>(
    node: UnknownExpandedTaskNode<TKind>,
  ): MayBePromise<OperationResult> {
    let dependenciesResult: MayBePromise<OperationResult<unknown[]>>;

    if (node.dependencies === undefined) {
      dependenciesResult = {
        success: true,
        value: [],
      };
    } else {
      dependenciesResult = this.#innerRunDependencies(node.dependencies);
    }

    let result: MayBePromise<OperationResult>;

    if (isPromiseLike(dependenciesResult)) {
      result = this.#innerRunAsync(
        node,
        dependenciesResult,
      ) as MayBePromise<OperationResult>;
    } else {
      result = this.#dependenciesRunResultToNodeTaskOperationResult(
        node,
        dependenciesResult,
      );
    }

    return result;
  }

  async #innerRunAsync<TKind>(
    node: UnknownExpandedTaskNode<TKind>,
    dependenciesResultAsync: PromiseLike<OperationResult<unknown[]>>,
  ): Promise<OperationResult> {
    const dependenciesResult: OperationResult<unknown[]> =
      await dependenciesResultAsync;

    const result: MayBePromise<OperationResult> =
      this.#dependenciesRunResultToNodeTaskOperationResult(
        node,
        dependenciesResult,
      );

    return result;
  }

  #innerRunAndDependencies<TKind>(
    nodeDependencies: AndNodeDependencies<UnknownExpandedTask<TKind>>,
  ): MayBePromise<OperationResult<unknown[]>> {
    let result: MayBePromise<OperationResult<unknown[]>>;

    let resultSuccess: boolean = true;
    const resultValues: unknown[] = [];

    const nodeDependenciesIterator: IterableIterator<
      UnknownExpandedTaskNodeDependency<TKind>
    > = nodeDependencies.nodes.values();

    for (const nodeDependency of nodeDependenciesIterator) {
      const dependencyResult: MayBePromise<OperationResult> =
        this.#innerRunDependency(nodeDependency);

      if (isPromiseLike(dependencyResult)) {
        return this.#innerRunAndDependenciesAsync(
          nodeDependenciesIterator,
          resultValues,
          dependencyResult,
        ) as MayBePromise<OperationResult<unknown[]>>;
      } else {
        if (dependencyResult.success) {
          resultValues.push(dependencyResult.value);
        } else {
          resultSuccess = false;
          break;
        }
      }
    }

    if (resultSuccess) {
      result = {
        success: true,
        value: resultValues,
      };
    } else {
      result = {
        success: false,
      };
    }

    return result;
  }

  async #innerRunAndDependenciesAsync<TKind>(
    nodeDependenciesIterator: IterableIterator<
      UnknownExpandedTaskNodeDependency<TKind>
    >,
    resultValues: unknown[],
    dependencyResultAsync: Promise<OperationResult>,
  ): Promise<OperationResult<unknown[]>> {
    const remainingAsyncOperationResults: Promise<OperationResult>[] = [
      dependencyResultAsync,
      ...mapIterable(
        nodeDependenciesIterator,
        async (nodeDependency: UnknownExpandedTaskNodeDependency<TKind>) =>
          this.#innerRunDependency(nodeDependency),
      ),
    ];

    const remainingOperationResult: OperationResult[] = await Promise.all(
      remainingAsyncOperationResults,
    );

    let result: OperationResult<unknown[]>;

    if (this.#isSuccessResultArray(remainingOperationResult)) {
      const remainingResults: unknown[] = remainingOperationResult.map(
        (dependencyResult: SucessResult) => dependencyResult.value,
      );

      result = {
        success: true,
        value: [...resultValues, ...remainingResults],
      };
    } else {
      result = {
        success: false,
      };
    }

    return result;
  }

  #innerRunDependencies<TKind>(
    nodeDependencies: NodeDependencies<UnknownExpandedTask<TKind>>,
  ): MayBePromise<OperationResult<unknown[]>> {
    let result: MayBePromise<OperationResult<unknown[]>>;

    switch (nodeDependencies.type) {
      case NodeDependenciesType.and:
        result = this.#innerRunAndDependencies(nodeDependencies);
        break;
      case NodeDependenciesType.bitwiseOr:
        result = this.#innerRunOrElseDependencies(nodeDependencies);
        break;
    }

    return result;
  }

  #innerRunDependency<TKind>(
    nodeDependency: NodeDependency<UnknownExpandedTask<TKind>>,
  ): MayBePromise<OperationResult<unknown>> {
    if (
      (nodeDependency as NodeDependencies<UnknownExpandedTask<TKind>>).nodes ===
      undefined
    ) {
      return this.#innerRun(nodeDependency as Node<UnknownExpandedTask<TKind>>);
    } else {
      return this.#innerRunDependencies(
        nodeDependency as NodeDependencies<UnknownExpandedTask<TKind>>,
      );
    }
  }

  #innerRunOrElseDependencies<TKind>(
    nodeDependencies: BitwiseOrNodeDependencies<UnknownExpandedTask<TKind>>,
  ): MayBePromise<OperationResult<unknown[]>> {
    let result: MayBePromise<OperationResult<unknown[]>>;

    const resultValues: unknown[] = [];

    const nodeDependenciesIterator: IterableIterator<
      UnknownExpandedTaskNodeDependency<TKind>
    > = nodeDependencies.nodes.values();

    for (const nodeDependency of nodeDependenciesIterator) {
      const dependencyResult: MayBePromise<OperationResult> =
        this.#innerRunDependency(nodeDependency);

      if (isPromiseLike(dependencyResult)) {
        return this.#innerRunOrElseDependenciesAsync(
          nodeDependenciesIterator,
          dependencyResult,
        ) as MayBePromise<OperationResult<unknown[]>>;
      } else {
        if (dependencyResult.success) {
          resultValues.push(dependencyResult.value);
          break;
        }
      }
    }

    if (resultValues.length > 0) {
      result = {
        success: true,
        value: resultValues,
      };
    } else {
      result = {
        success: false,
      };
    }

    return result;
  }

  async #innerRunOrElseDependenciesAsync<TKind>(
    nodeDependenciesIterator: IterableIterator<
      UnknownExpandedTaskNodeDependency<TKind>
    >,
    dependencyResultAsync: Promise<OperationResult>,
  ): Promise<OperationResult<unknown[]>> {
    let result: OperationResult<unknown[]>;

    const dependencyResult: OperationResult = await dependencyResultAsync;

    if (dependencyResult.success) {
      result = {
        success: true,
        value: [dependencyResult.value],
      };
    } else {
      const resultValues: unknown[] = [];

      for (const nodeDependency of nodeDependenciesIterator) {
        const dependencyResult: OperationResult =
          await this.#innerRunDependency(nodeDependency);

        if (dependencyResult.success) {
          resultValues.push(dependencyResult.value);
          break;
        }
      }

      if (resultValues.length > 0) {
        result = {
          success: true,
          value: resultValues,
        };
      } else {
        result = {
          success: false,
        };
      }
    }

    return result;
  }

  #innerRunTask<TKind>(
    task: UnknownExpandedTask<TKind>,
    dependenciesRunResults: NonThenableProperties<unknown[]>,
  ): MayBePromise<OperationResult> {
    try {
      const taskResult: unknown = task.perform(...dependenciesRunResults);

      if (isPromiseLike(taskResult)) {
        return this.#taskResultAsyncToOperationResult(
          task,
          taskResult,
        ) as MayBePromise<OperationResult>;
      } else {
        return this.#taskResultToOperationResult(task, taskResult);
      }
    } catch (_error: unknown) {
      return {
        success: false,
      };
    }
  }

  #isSuccessResultArray(
    operationResultArray: OperationResult[],
  ): operationResultArray is SucessResult[] {
    return operationResultArray.every(
      (operationResult: OperationResult) => operationResult.success,
    );
  }

  #runResult<TReturn>(result: OperationResult): TReturn {
    if (result.success) {
      return result.value as TReturn;
    } else {
      throw new Error('Unable to recover from at least one task failure');
    }
  }

  async #runResultAsync<TReturn>(
    resultAsync: PromiseLike<OperationResult>,
  ): Promise<TReturn> {
    const result: OperationResult = await resultAsync;

    return this.#runResult(result);
  }

  #taskResultToOperationResult<TKind>(
    task: UnknownExpandedTask<TKind>,
    taskResult: unknown,
  ): OperationResult {
    if (task.status === TaskStatus.Ended) {
      return {
        success: true,
        value: taskResult,
      };
    } else {
      return {
        success: false,
      };
    }
  }

  async #taskResultAsyncToOperationResult<TKind>(
    task: UnknownExpandedTask<TKind>,
    taskResultAsync: PromiseLike<unknown>,
  ): Promise<OperationResult> {
    try {
      const taskResult: unknown = await taskResultAsync;

      return this.#taskResultToOperationResult(task, taskResult);
    } catch (_error: unknown) {
      return {
        success: false,
      };
    }
  }
}
