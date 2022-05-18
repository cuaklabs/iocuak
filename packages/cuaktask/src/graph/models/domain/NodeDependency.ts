import { Node } from './Node';
import { NodeDependencies } from './NodeDependencies';

export type NodeDependency<TElem> = Node<TElem> | NodeDependencies<TElem>;
