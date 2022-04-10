export interface TaskDependencyKindGraphNode<TKind> {
  /**
   * Task kind dependencies. Circular dependencies are not expected
   */
  dependencies: TaskDependencyKindGraphNode<TKind>[];
  /**
   * Task kind
   */
  kind: TKind;
}
