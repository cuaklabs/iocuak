import { TaskStatus } from './TaskStatus';

export interface Task<TKind, TArgs extends unknown[], TReturn> {
  readonly kind: TKind;
  status: TaskStatus;
  perform(...args: TArgs): TReturn;
}
