import { ServiceId } from '../../task/models/domain/ServiceId';
import { ClassMetadata } from '../models/domain/ClassMetadata';

export interface ClassMetadataProvider {
  getMetadata(type: ServiceId): ClassMetadata;
}
