import { Newable } from '@cuaklabs/iocuak-common';
import { TypeBindingApi } from '@cuaklabs/iocuak-models-api';

import { ClassMetadataApi } from '../../../classMetadata/models/api/ClassMetadataApi';

export interface MetadataServiceApi {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBindingApi<TInstance, TArgs> | undefined;

  getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadataApi;
}
