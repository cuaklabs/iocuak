import { Newable } from '../../../common/models/domain/Newable';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { TypeBinding } from '../../../metadata/models/domain/TypeBinding';

export interface ContainerMetadataService {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBinding<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadata;
}
