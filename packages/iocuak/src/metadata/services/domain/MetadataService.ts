import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { Newable } from '../../../common/models/domain/Newable';
import { TypeBinding } from '../../models/domain/TypeBinding';

export interface MetadataService {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBinding<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadata;
}
