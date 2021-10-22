import { Binding } from '../../../binding/models/domain/Binding';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { Newable } from '../../../task/models/domain/Newable';

export interface ContainerMetadataService {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): Binding<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadata;
}
