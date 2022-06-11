import { RootedGraph } from '../../graph/models/domain/RootedGraph';
import { Task } from '../models/domain/Task';

export interface TaskGraphEngine<TTaskKind> {
  create(taskKind: TTaskKind): RootedGraph<Task<TTaskKind>>;
}
