import { Task } from './Task';

export interface DependentTask<TKind, TArgs extends unknown[], TReturn>
  extends Task<TKind, TArgs, TReturn> {
  readonly dependencies: DependentTask<TKind, unknown[], unknown>[];
}
