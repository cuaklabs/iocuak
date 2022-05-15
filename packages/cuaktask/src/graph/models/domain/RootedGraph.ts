import { Graph } from './Graph';
import { Node } from './Node';

export interface RootedGraph<TElem> extends Graph<TElem> {
  root: Node<TElem>;
}
