import { ClassMetadataApi } from '../../../classMetadata/models/api/ClassMetadataApi';
import { Newable } from '../../../common/models/domain/Newable';
import { TypeBindingApi } from '../../models/api/TypeBindingApi';

export interface MetadataServiceApi {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBindingApi<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadataApi;
}
