import { TypeBindingApi } from '../../../binding/models/api/TypeBindingApi';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { Newable } from '../../../common/models/domain/Newable';
import { ClassMetadataApi } from '../../../metadata/models/api/ClassMetadataApi';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { convertClassMetadataToClassMetadataApi } from '../../../metadata/utils/api/convertClassMetadataToClassMetadataApi';
import { ContainerMetadataService } from '../domain/ContainerMetadataService';
import { MetadataApiService } from './MetadataApiService';

export class MetadataApiServiceImplementation implements MetadataApiService {
  readonly #containerMetadataService: ContainerMetadataService;

  constructor(containerMetadataService: ContainerMetadataService) {
    this.#containerMetadataService = containerMetadataService;
  }

  public getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBindingApi<TInstance, TArgs> | undefined {
    const typeBinding: TypeBinding<TInstance, TArgs> | undefined =
      this.#containerMetadataService.getBindingMetadata(type);

    return typeBinding === undefined
      ? undefined
      : convertBindingToBindingApi(typeBinding);
  }

  public getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadataApi {
    const classMetadata: ClassMetadata =
      this.#containerMetadataService.getClassMetadata(type);

    return convertClassMetadataToClassMetadataApi(classMetadata);
  }
}
