import { TypeBindingApi } from '../../../binding/models/api/TypeBindingApi';
import { Newable } from '../../../common/models/domain/Newable';
import { ClassMetadataApi } from '../../../metadata/models/api/ClassMetadataApi';

export interface MetadataApiService {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBindingApi<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadataApi;
}
