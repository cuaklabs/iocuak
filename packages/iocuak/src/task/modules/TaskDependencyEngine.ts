import * as cuaktask from '@cuaklabs/cuaktask';

import { Builder } from '../../common/modules/domain/Builder';
import { SetLike } from '../../common/modules/domain/SetLike';
import { unsafeLast } from '../../common/utils/unsafeLast';
import { stringifyServiceId } from '../../utils/stringifyServiceId';
import { TaskKind } from '../models/domain/TaskKind';
import { DirectTaskDependencyEngine } from './DirectTaskDependencyEngine';

export class TaskDependencyEngine
  implements cuaktask.TaskDependencyEngine<TaskKind>
{
  readonly #directTaskDependencyEngine: DirectTaskDependencyEngine;
  readonly #taskKindSerBuilder: Builder<SetLike<TaskKind>>;

  constructor(
    directTaskDependencyEngine: DirectTaskDependencyEngine,
    taskKindSerBuilder: Builder<SetLike<TaskKind>>,
  ) {
    this.#directTaskDependencyEngine = directTaskDependencyEngine;
    this.#taskKindSerBuilder = taskKindSerBuilder;
  }

  public getDependencies(
    taskKind: TaskKind,
  ): cuaktask.TaskDependencyKindGraph<TaskKind> {
    const taskDependencyKindGraphRootNode: cuaktask.TaskDependencyKindGraphNode<TaskKind> =
      {
        dependencies: [],
        kind: taskKind,
      };

    const taskDependencyKindGraphNodes: cuaktask.TaskDependencyKindGraphNode<TaskKind>[] =
      this.#expandKindGraphNodes(taskDependencyKindGraphRootNode);

    const taskDependencyKindGraph: cuaktask.TaskDependencyKindGraph<TaskKind> =
      {
        nodes: taskDependencyKindGraphNodes,
        rootNode: taskDependencyKindGraphRootNode,
      };

    return taskDependencyKindGraph;
  }

  #expandKindGraphNodes(
    taskDependencyKindGraphRootNode: cuaktask.TaskDependencyKindGraphNode<TaskKind>,
  ): cuaktask.TaskDependencyKindGraphNode<TaskKind>[] {
    const taskKindSet: SetLike<TaskKind> = this.#taskKindSerBuilder.build();
    const taskDependencyKindGraphNodes: cuaktask.TaskDependencyKindGraphNode<TaskKind>[] =
      [taskDependencyKindGraphRootNode];
    const kindGraphNodesStackStack: cuaktask.TaskDependencyKindGraphNode<TaskKind>[][] =
      [[taskDependencyKindGraphRootNode]];

    while (kindGraphNodesStackStack.length > 0) {
      const topKindGraphNodesStack: cuaktask.TaskDependencyKindGraphNode<TaskKind>[] =
        unsafeLast(kindGraphNodesStackStack);

      if (topKindGraphNodesStack.length === 0) {
        this.#expandKindGraphNodesPopStackStack(
          kindGraphNodesStackStack,
          taskKindSet,
        );
      } else {
        const nextStackStackElement: cuaktask.TaskDependencyKindGraphNode<TaskKind>[] =
          this.#expandKindGraphNodesBuildNextStackStackElement(
            topKindGraphNodesStack,
            taskKindSet,
          );

        taskDependencyKindGraphNodes.push(...nextStackStackElement);
        kindGraphNodesStackStack.push(nextStackStackElement);
      }
    }

    return taskDependencyKindGraphNodes;
  }

  #expandKindGraphNodesBuildNextStackStackElement(
    topKindGraphNodesStack: cuaktask.TaskDependencyKindGraphNode<TaskKind>[],
    taskKindSet: SetLike<TaskKind>,
  ): cuaktask.TaskDependencyKindGraphNode<TaskKind>[] {
    const topKindGraphNode: cuaktask.TaskDependencyKindGraphNode<TaskKind> =
      unsafeLast(topKindGraphNodesStack);

    if (taskKindSet.has(topKindGraphNode.kind)) {
      throw new Error(
        `Circular dependency found related to ${stringifyServiceId(
          topKindGraphNode.kind.id,
        )}!`,
      );
    } else {
      taskKindSet.add(topKindGraphNode.kind);

      const taskDependencyKindGraphNodeKindDependencies: TaskKind[] =
        this.#directTaskDependencyEngine.getDirectDependencies(
          topKindGraphNode.kind,
        );

      const taskDependencyKindGraphNodeDependencies: cuaktask.TaskDependencyKindGraphNode<TaskKind>[] =
        taskDependencyKindGraphNodeKindDependencies.map(
          (taskKind: TaskKind) => ({ dependencies: [], kind: taskKind }),
        );

      topKindGraphNode.dependencies = [
        ...taskDependencyKindGraphNodeDependencies,
      ];

      return taskDependencyKindGraphNodeDependencies;
    }
  }

  #expandKindGraphNodesPopStackStack(
    kindGraphNodesStackStack: cuaktask.TaskDependencyKindGraphNode<TaskKind>[][],
    taskKindSet: SetLike<TaskKind>,
  ): void {
    kindGraphNodesStackStack.pop();

    if (kindGraphNodesStackStack.length > 0) {
      const topKindGraphNodesStack: cuaktask.TaskDependencyKindGraphNode<TaskKind>[] =
        unsafeLast(kindGraphNodesStackStack);

      const topKindGraphNode: cuaktask.TaskDependencyKindGraphNode<TaskKind> =
        topKindGraphNodesStack.pop() as cuaktask.TaskDependencyKindGraphNode<TaskKind>;

      taskKindSet.delete(topKindGraphNode.kind);
    }
  }
}
