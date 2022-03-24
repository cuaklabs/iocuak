import { TaskScope } from '../domain/TaskScope';
import { TaskScopeApi } from './TaskScopeApi';

export const taskScopeApiToTaskScopeMap: { [TKey in TaskScopeApi]: TaskScope } =
  {
    [TaskScopeApi.request]: TaskScope.request,
    [TaskScopeApi.singleton]: TaskScope.singleton,
    [TaskScopeApi.transient]: TaskScope.transient,
  };
