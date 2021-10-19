import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { InjectDecoratorMetadata } from '../../../metadata/models/domain/InjectDecoratorMetadata';
import { MetadataKey } from '../../../metadata/models/domain/MetadataKey';
import { getReflectMetadata } from '../../../metadata/utils/getReflectMetadata';
import { Newable } from '../../../task/models/domain/Newable';
import { ContainerMetadataService } from './ContainerMetadataService';

export class ContainerMetadataServiceImplementation
  implements ContainerMetadataService
{
  public get(type: Newable<unknown, unknown[]>): ClassMetadata | undefined {
    const injectDecoratorMetadata: InjectDecoratorMetadata | undefined =
      getReflectMetadata(type, MetadataKey.inject);

    if (injectDecoratorMetadata === undefined) {
      return undefined;
    } else {
      const classMetadata: ClassMetadata = {
        constructorArguments: [...injectDecoratorMetadata.parameters],
        properties: new Map(injectDecoratorMetadata.properties),
      };

      return classMetadata;
    }
  }
}
