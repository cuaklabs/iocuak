import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { Newable } from '../../../common/models/domain/Newable';
import { getDefaultClassMetadata } from '../../../metadata/decorators/getDefaultClassMetadata';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { MetadataKey } from '../../../metadata/models/domain/MetadataKey';
import { getReflectMetadata } from '../../../metadata/utils/getReflectMetadata';
import { ContainerMetadataService } from './ContainerMetadataService';

export class ContainerMetadataServiceImplementation
  implements ContainerMetadataService
{
  public getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBinding<TInstance, TArgs> | undefined {
    const binding: TypeBinding<TInstance, TArgs> | undefined =
      getReflectMetadata(type, MetadataKey.injectable);

    return binding;
  }

  public getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadata {
    const classMetadata: ClassMetadata | undefined = getReflectMetadata(
      type,
      MetadataKey.inject,
    );

    let classMetadataClone: ClassMetadata;

    if (classMetadata === undefined) {
      classMetadataClone = getDefaultClassMetadata();
    } else {
      classMetadataClone = {
        constructorArguments: [...classMetadata.constructorArguments],
        properties: new Map(classMetadata.properties),
      };
    }

    return classMetadataClone;
  }
}
