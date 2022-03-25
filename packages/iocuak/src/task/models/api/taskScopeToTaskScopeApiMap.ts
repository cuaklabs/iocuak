import { TaskScope } from '../domain/TaskScope';
import { TaskScopeApi } from './TaskScopeApi';

export const taskScopeToTaskScopeApiMap: { [TKey in TaskScope]: TaskScopeApi } =
  {
    [TaskScope.request]: TaskScopeApi.request,
    [TaskScope.singleton]: TaskScopeApi.singleton,
    [TaskScope.transient]: TaskScopeApi.transient,
  };
