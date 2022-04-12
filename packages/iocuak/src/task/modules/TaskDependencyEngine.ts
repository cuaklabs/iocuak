import * as cuaktask from '@cuaklabs/cuaktask';

import { Builder } from '../../common/modules/domain/Builder';
import { SetLike } from '../../common/modules/domain/SetLike';
import { unsafeLast } from '../../common/utils/unsafeLast';
import { stringifyServiceId } from '../../utils/stringifyServiceId';
import { TaskKind } from '../models/domain/TaskKind';
import { DirectTaskDependencyEngine } from './DirectTaskDependencyEngine';

type TaskKindGraphNode = cuaktask.TaskDependencyKindGraphNode<
  TaskKind,
  TaskKind
>;

type TaskKindGraph = cuaktask.TaskDependencyKindGraph<TaskKind, TaskKind>;

export class TaskDependencyEngine
  implements cuaktask.TaskDependencyEngine<TaskKind, TaskKind>
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

  public getDependencies(taskKind: TaskKind): TaskKindGraph {
    const taskDependencyKindGraphRootNode: TaskKindGraphNode = {
      dependencies: [],
      kind: taskKind,
    };

    const taskDependencyKindGraphNodes: TaskKindGraphNode[] =
      this.#expandKindGraphNodes(taskDependencyKindGraphRootNode);

    const taskDependencyKindGraph: TaskKindGraph = {
      nodes: taskDependencyKindGraphNodes,
      rootNode: taskDependencyKindGraphRootNode,
    };

    return taskDependencyKindGraph;
  }

  #expandKindGraphNodes(
    taskDependencyKindGraphRootNode: TaskKindGraphNode,
  ): TaskKindGraphNode[] {
    const taskKindSet: SetLike<TaskKind> = this.#taskKindSerBuilder.build();
    const taskDependencyKindGraphNodes: TaskKindGraphNode[] = [
      taskDependencyKindGraphRootNode,
    ];
    const kindGraphNodesStackStack: TaskKindGraphNode[][] = [
      [taskDependencyKindGraphRootNode],
    ];

    while (kindGraphNodesStackStack.length > 0) {
      const topKindGraphNodesStack: TaskKindGraphNode[] = unsafeLast(
        kindGraphNodesStackStack,
      );

      if (topKindGraphNodesStack.length === 0) {
        this.#expandKindGraphNodesPopStackStack(
          kindGraphNodesStackStack,
          taskKindSet,
        );
      } else {
        const nextStackStackElement: TaskKindGraphNode[] =
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
    topKindGraphNodesStack: TaskKindGraphNode[],
    taskKindSet: SetLike<TaskKind>,
  ): TaskKindGraphNode[] {
    const topKindGraphNode: TaskKindGraphNode = unsafeLast(
      topKindGraphNodesStack,
    );

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

      const taskDependencyKindGraphNodeDependencies: TaskKindGraphNode[] =
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
    kindGraphNodesStackStack: TaskKindGraphNode[][],
    taskKindSet: SetLike<TaskKind>,
  ): void {
    kindGraphNodesStackStack.pop();

    if (kindGraphNodesStackStack.length > 0) {
      const topKindGraphNodesStack: TaskKindGraphNode[] = unsafeLast(
        kindGraphNodesStackStack,
      );

      const topKindGraphNode: TaskKindGraphNode =
        topKindGraphNodesStack.pop() as TaskKindGraphNode;

      taskKindSet.delete(topKindGraphNode.kind);
    }
  }
}
