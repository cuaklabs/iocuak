export interface TaskDependencyEngine {
  getDependencies<TKind, TDependencyKind>(taskKind: TKind): TDependencyKind[];
}
