import { getBindingMetadata } from '@cuaklabs/iocuak-binding';
import {
  ClassMetadata,
  getClassMetadata,
} from '@cuaklabs/iocuak-class-metadata';
import { Newable } from '@cuaklabs/iocuak-common';

import { TypeBindingApi } from '../../../binding/models/api/TypeBindingApi';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { ClassMetadataApi } from '../../../classMetadata/models/api/ClassMetadataApi';
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
