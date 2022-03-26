import { Newable } from '../../../common/models/domain/Newable';
import { getDefaultClassMetadata } from '../../decorators/getDefaultClassMetadata';
import { ClassMetadata } from '../../models/domain/ClassMetadata';
import { MetadataKey } from '../../models/domain/MetadataKey';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { getReflectMetadata } from '../../utils/getReflectMetadata';
import { MetadataService } from './MetadataService';

export class MetadataServiceImplementation implements MetadataService {
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
