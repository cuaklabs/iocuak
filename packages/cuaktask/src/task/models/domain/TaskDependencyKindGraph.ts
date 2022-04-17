import { TaskDependencyKindGraphNode } from './TaskDependencyKindGraphNode';

/**
 * Represents a task dependency graph
 */
export interface TaskDependencyKindGraph<
  TKind = unknown,
  TDependencyKind = unknown,
> {
  /**
   * Root node
   */
  rootNode: TaskDependencyKindGraphNode<TKind, TDependencyKind>;
  /**
   * All the graph nodes, including the root one
   */
  nodes: TaskDependencyKindGraphNode<TKind, TDependencyKind>[];
}
