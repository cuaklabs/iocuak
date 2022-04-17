export interface TaskDependencyKindGraphNode<
  TKind = unknown,
  TDependencyKind = unknown,
> {
  /**
   * Task kind dependencies. Circular dependencies are not expected
   */
  dependencies: TaskDependencyKindGraphNode<TDependencyKind, unknown>[];
  /**
   * Task kind
   */
  kind: TKind;
}
