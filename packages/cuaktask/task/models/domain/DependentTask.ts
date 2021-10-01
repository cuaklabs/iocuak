import { Task } from './Task';

export interface DependentTask<
  TKind,
  TDependencyKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> extends Task<TKind, TArgs, TReturn> {
  readonly dependencies: DependentTask<TDependencyKind>[];
}
