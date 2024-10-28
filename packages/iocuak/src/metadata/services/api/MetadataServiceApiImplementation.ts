import { Newable } from '@cuaklabs/iocuak-common';
import { getBindingMetadata, getClassMetadata } from '@cuaklabs/iocuak-core';
import { ClassMetadata, TypeBinding } from '@cuaklabs/iocuak-models';
import { ClassMetadataApi, TypeBindingApi } from '@cuaklabs/iocuak-models-api';

import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { convertToClassMetadataApi } from '../../../classMetadata/utils/api/convertToClassMetadataApi';
import { MetadataServiceApi } from './MetadataServiceApi';

export class MetadataServiceApiImplementation implements MetadataServiceApi {
  public getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBindingApi<TInstance, TArgs> | undefined {
    const typeBinding: TypeBinding<TInstance, TArgs> | undefined =
      getBindingMetadata(type);

    return typeBinding === undefined
      ? undefined
      : convertBindingToBindingApi(typeBinding);
  }

  public getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadataApi {
    const classMetadata: ClassMetadata = getClassMetadata(type);

    return convertToClassMetadataApi(classMetadata);
  }
}
