import { AndNodeDependencies } from './AndNodeDependencies';
import { BitwiseOrNodeDependencies } from './BitwiseOrNodeDependencies';

export type NodeDependencies<TElem> =
  | AndNodeDependencies<TElem>
  | BitwiseOrNodeDependencies<TElem>;
