import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { Newable } from '../../../common/models/domain/Newable';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';

export interface ContainerMetadataService {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBinding<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadata;
}
