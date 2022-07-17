import { ClassMetadata, getClassMetadata } from '@cuaklabs/iocuak-metadata';

import { TypeBindingApi } from '../../../binding/models/api/TypeBindingApi';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { ClassMetadataApi } from '../../../classMetadata/models/api/ClassMetadataApi';
import { convertToClassMetadataApi } from '../../../classMetadata/utils/api/convertToClassMetadataApi';
import { Newable } from '../../../common/models/domain/Newable';
import { MetadataService } from '../domain/MetadataService';
import { MetadataServiceApi } from './MetadataServiceApi';

export class MetadataServiceApiImplementation implements MetadataServiceApi {
  readonly #metadataService: MetadataService;

  constructor(metadataService: MetadataService) {
    this.#metadataService = metadataService;
  }

  public getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBindingApi<TInstance, TArgs> | undefined {
    const typeBinding: TypeBinding<TInstance, TArgs> | undefined =
      this.#metadataService.getBindingMetadata(type);

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
