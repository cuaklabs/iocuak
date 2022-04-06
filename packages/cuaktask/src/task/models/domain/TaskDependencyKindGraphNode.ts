export interface TaskDependencyKindGraphNode<TKind> {
  dependencies: TaskDependencyKindGraphNode<TKind>;
  kind: TKind;
}
