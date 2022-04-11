import { Builder } from '../../common/modules/Builder';
import { DependentTask } from '../models/domain/DependentTask';
import { TaskDependencyKindGraph } from '../models/domain/TaskDependencyKindGraph';
import { TaskDependencyKindGraphNode } from '../models/domain/TaskDependencyKindGraphNode';
import { TaskDependencyEngine } from './TaskDependencyEngine';

interface TaskDependencyKindGraphNodeWitOptionalTask<TKind>
  extends TaskDependencyKindGraphNode<TKind> {
  dependentTask?: DependentTask<TKind, unknown, unknown[], unknown>;
}

interface TaskDependencyGraphNodeWithTask<TKind>
  extends TaskDependencyKindGraphNode<TKind> {
  dependencies: TaskDependencyGraphNodeWithTask<TKind>[];
  dependentTask: DependentTask<TKind, unknown, unknown[], unknown>;
}

export class DependentTaskBuildOperation<
  TKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> {
  readonly #taskWithNoDependenciesBuilder: Builder<
    DependentTask<TKind, unknown, TArgs, TReturn>,
    [TKind]
  >;
  readonly #taskDependencyEngine: TaskDependencyEngine<TKind>;

  constructor(
    taskWithNoDependenciesBuilder: Builder<
      DependentTask<TKind, unknown, TArgs, TReturn>,
      [TKind]
    >,
    taskDependencyEngine: TaskDependencyEngine<TKind>,
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
    const taskDependenciesKindGraph: TaskDependencyKindGraph<TKind> =
      this.#taskDependencyEngine.getDependencies(taskKind);

    this.#fillTaskDependenciesKindGraphWithTasks(taskDependenciesKindGraph);
    this.#fillTaskDependenciesKindGraphWithTaskDependencies(
      taskDependenciesKindGraph,
    );

    return this.#getRootDependentTask(taskDependenciesKindGraph);
  }

  #getRootDependentTask(
    taskDependenciesKindGraph: TaskDependencyKindGraph<TKind>,
  ): DependentTask<TKind, TKind, TArgs, TReturn> {
    const rootTaskDepencyNode: DependentTask<TKind, TKind, TArgs, TReturn> = (
      taskDependenciesKindGraph.rootNode as TaskDependencyGraphNodeWithTask<TKind>
    ).dependentTask as DependentTask<TKind, TKind, TArgs, TReturn>;

    return rootTaskDepencyNode;
  }

  #fillTaskDependenciesKindGraphWithTasks(
    taskDependenciesKindGraph: TaskDependencyKindGraph<TKind>,
  ): void {
    for (const taskDependenciesKindGraphNode of taskDependenciesKindGraph.nodes as TaskDependencyKindGraphNodeWitOptionalTask<TKind>[]) {
      taskDependenciesKindGraphNode.dependentTask =
        this.#taskWithNoDependenciesBuilder.build(
          taskDependenciesKindGraphNode.kind,
        );
    }
  }

  #fillTaskDependenciesKindGraphWithTaskDependencies(
    taskDependenciesKindGraph: TaskDependencyKindGraph<TKind>,
  ): void {
    for (const taskDependenciesKindGraphNode of taskDependenciesKindGraph.nodes as TaskDependencyGraphNodeWithTask<TKind>[]) {
      const taskDependencies: DependentTask<TKind>[] =
        taskDependenciesKindGraphNode.dependencies.map(
          (
            taskDependenciesKindGraphNode: TaskDependencyGraphNodeWithTask<TKind>,
          ) => taskDependenciesKindGraphNode.dependentTask,
        );

      taskDependenciesKindGraphNode.dependentTask.dependencies.push(
        ...taskDependencies,
      );
    }
  }
}
