import { TaskStatus } from './TaskStatus';

export interface Task<TKind, TArgs extends unknown[], TReturn> {
  kind: TKind;
  status: TaskStatus;
  perform(...args: TArgs): TReturn;
}
