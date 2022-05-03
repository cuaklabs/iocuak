import { ClassMetadataApi } from '../../../classMetadata/models/api/ClassMetadataApi';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { convertToClassMetadataApi } from '../../../classMetadata/utils/api/convertToClassMetadataApi';
import { Newable } from '../../../common/models/domain/Newable';
import { TypeBindingApi } from '../../models/api/TypeBindingApi';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { convertBindingToBindingApi } from '../../utils/api/convertBindingToBindingApi';
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
    const classMetadata: ClassMetadata =
      this.#metadataService.getClassMetadata(type);

    return convertToClassMetadataApi(classMetadata);
  }
}
