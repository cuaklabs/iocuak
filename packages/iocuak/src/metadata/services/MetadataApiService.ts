import { Newable } from '../../common/models/domain/Newable';
import { ClassMetadataApi } from '../models/api/ClassMetadataApi';
import { TypeBindingApi } from '../models/api/TypeBindingApi';

export interface MetadataApiService {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBindingApi<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadataApi;
}
