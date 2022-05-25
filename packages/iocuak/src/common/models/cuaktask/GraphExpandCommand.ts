import { Graph, Node, Task } from '@cuaklabs/cuaktask';

export interface GraphExpandCommand<
  TTaskKindType,
  TGraphNode extends Node<Task<unknown>>,
  TNode extends TGraphNode,
> {
  graph: Graph<TGraphNode>;
  node: TNode;
  taskKindType: TTaskKindType;
}
