import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { getBindingOrThrow } from '../../binding/utils/domain/getBindingOrThrow';
import { Newable } from '../../common/models/domain/Newable';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { ContainerBindingService } from '../services/domain/ContainerBindingService';

export function bind<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
  containerBindingService: ContainerBindingService,
  metadataService: MetadataService,
): void {
  const bindingFromType: TypeBinding<TInstance, TArgs> = getBindingOrThrow(
    type,
    metadataService,
  );

  containerBindingService.set(bindingFromType);
}
