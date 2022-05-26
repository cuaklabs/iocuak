import { Graph, Task } from '@cuaklabs/cuaktask';

export interface TaskGraphExpandOperationContext {
  graph: Graph<Task<unknown>>;
}
