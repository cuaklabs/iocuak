import { Binding } from '../../../binding/models/domain/Binding';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { MetadataKey } from '../../../metadata/models/domain/MetadataKey';
import { getReflectMetadata } from '../../../metadata/utils/getReflectMetadata';
import { Newable } from '../../../task/models/domain/Newable';
import { ContainerMetadataService } from './ContainerMetadataService';

export class ContainerMetadataServiceImplementation
  implements ContainerMetadataService
{
  public getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): Binding<TInstance, TArgs> | undefined {
    const binding: Binding<TInstance, TArgs> | undefined = getReflectMetadata(
      type,
      MetadataKey.injectable,
    );

    return binding;
  }

  public getClassMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): ClassMetadata | undefined {
    const classMetadata: ClassMetadata | undefined = getReflectMetadata(
      type,
      MetadataKey.inject,
    );

    if (classMetadata === undefined) {
      return undefined;
    } else {
      const classMetadataClone: ClassMetadata = {
        constructorArguments: [...classMetadata.constructorArguments],
        properties: new Map(classMetadata.properties),
      };

      return classMetadataClone;
    }
  }
}
