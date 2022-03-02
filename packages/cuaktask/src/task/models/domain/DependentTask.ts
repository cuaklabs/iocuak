import { Task } from './Task';

/**
 * Represents a task which depends of a collection of dependencies.
 */
export interface DependentTask<
  TKind,
  TDependencyKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> extends Task<TKind, TArgs, TReturn> {
  /**
   * Task dependencies
   */
  readonly dependencies: DependentTask<TDependencyKind>[];
}
