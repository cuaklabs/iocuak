import { Binding } from '../../../binding/models/domain/Binding';
import { Newable } from '../../../common/models/domain/Newable';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';

export interface ContainerMetadataService {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): Binding<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadata;
}
