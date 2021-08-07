import { NonThenableProperties } from '../../../common/models/NonThenableProperties';
import { TaskStatus } from './TaskStatus';

export interface Task<TKind, TArgs extends unknown[], TReturn> {
  readonly kind: TKind;
  readonly status: TaskStatus;
  perform(...args: NonThenableProperties<TArgs>): TReturn;
}
