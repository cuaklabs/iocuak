import { Newable } from '@cuaklabs/iocuak-common';
import { TypeBindingApi, ClassMetadataApi } from '@cuaklabs/iocuak-models-api';

export interface MetadataServiceApi {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBindingApi<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadataApi;
}
