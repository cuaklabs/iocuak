import { Newable } from '../../common/models/domain/Newable';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { TypeBinding } from '../../metadata/models/domain/TypeBinding';
import { MetadataService } from '../../metadata/services/domain/MetadataService';

export function bind<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
  containerBindingService: ContainerBindingService,
  metadataService: MetadataService,
): void {
  const bindingFromType: TypeBinding<TInstance, TArgs> | undefined =
    metadataService.getBindingMetadata(type);

  if (bindingFromType === undefined) {
    throw new Error(
      `No bindings found for type ${type.name}. An @injectable() decorator may be missing`,
    );
  } else {
    containerBindingService.set(bindingFromType);
  }
}
