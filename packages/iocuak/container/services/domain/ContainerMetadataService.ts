import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { Newable } from '../../../task/models/domain/Newable';

export interface ContainerMetadataService {
  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadata | undefined;
}
