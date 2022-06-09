import { Node } from './Node';

export interface Graph<TElem> {
  nodes: Set<Node<TElem>>;
}
