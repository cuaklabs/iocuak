import { Newable } from '../../../common/models/domain/Newable';
import { ContainerMetadataService } from '../../../container/services/domain/ContainerMetadataService';
import { ClassMetadataApi } from '../../models/api/ClassMetadataApi';
import { TypeBindingApi } from '../../models/api/TypeBindingApi';
import { ClassMetadata } from '../../models/domain/ClassMetadata';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { convertBindingToBindingApi } from '../../utils/api/convertBindingToBindingApi';
import { convertClassMetadataToClassMetadataApi } from '../../utils/api/convertClassMetadataToClassMetadataApi';
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
