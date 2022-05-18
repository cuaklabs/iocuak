import { AndNodeDependencies } from './AndNodeDependencies';
import { OrElseNodeDependencies } from './OrElseNodeDependencies';

export type NodeDependencies<TElem> =
  | AndNodeDependencies<TElem>
  | OrElseNodeDependencies<TElem>;
