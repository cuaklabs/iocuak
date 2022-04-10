import { TaskDependencyKindGraphNode } from './TaskDependencyKindGraphNode';

/**
 * Represents a task dependency graph
 */
export interface TaskDependencyKindGraph<TKind> {
  /**
   * Root node
   */
  rootNode: TaskDependencyKindGraphNode<TKind>;
  /**
   * All the graph nodes, including the root one
   */
  nodes: TaskDependencyKindGraphNode<TKind>[];
}
