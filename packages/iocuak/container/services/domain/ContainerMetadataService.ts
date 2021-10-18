import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { Newable } from '../../../task/models/domain/Newable';

export interface ContainerMetadataService {
  get(type: Newable): ClassMetadata | undefined;
}
