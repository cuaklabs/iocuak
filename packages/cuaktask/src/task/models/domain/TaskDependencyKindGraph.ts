import { TaskDependencyKindGraphNode } from './TaskDependencyKindGraphNode';

export interface TaskDependencyKindGraph<TKind> {
  rootNode: TaskDependencyKindGraphNode<TKind>;
  nodes: TaskDependencyKindGraphNode<TKind>[];
}
