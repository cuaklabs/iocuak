import { Graph, Node, Task } from '@cuaklabs/cuaktask';

export interface TaskGraphExpandCommand<
  TTaskKindType,
  TNodeTask extends Task<unknown>,
> {
  graph: Graph<Task<unknown>>;
  node: Node<TNodeTask, Task<unknown>>;
  taskKindType: TTaskKindType;
}
