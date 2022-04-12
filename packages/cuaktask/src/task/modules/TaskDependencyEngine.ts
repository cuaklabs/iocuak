import { TaskDependencyKindGraph } from '../models/domain/TaskDependencyKindGraph';

/**
 * Task dependency engine.
 *
 * This module takes the responsability of providing task kind dependencies given
 * a task kind.
 */
export interface TaskDependencyEngine<
  TKind = unknown,
  TDependencyKind = unknown,
> {
  /**
   * Determines task kind dependency graph given a task kind.
   * @param taskKind Task kind
   * @returns Task kind dependency graph.
   */
  getDependencies(
    taskKind: TKind,
  ): TaskDependencyKindGraph<TKind, TDependencyKind>;
}
