/**
 * Task dependency engine.
 *
 * This module takes the responsability of providing task kind dependencies given
 * a task kind.
 */
export interface TaskDependencyEngine {
  /**
   * Determines task kind dependencies given a task kind.
   * @param taskKind Task kind
   * @returns Task kind dependencies.
   */
  getDependencies<TKind, TDependencyKind>(taskKind: TKind): TDependencyKind[];
}
