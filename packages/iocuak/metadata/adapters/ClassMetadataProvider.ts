import { TaskId } from '../../task/models/domain/TaskId';
import { ClassMetadata } from '../models/ClassMetadata';

export interface ClassMetadataProvider {
  getMetadata(type: TaskId): ClassMetadata;
}
