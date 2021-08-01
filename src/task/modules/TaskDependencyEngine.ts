export interface TaskDependencyEngine<TKind> {
  getDependencies(taskKind: TKind): TKind[];
}
