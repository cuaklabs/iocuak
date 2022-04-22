import { Newable } from '../../common/models/domain/Newable';
import { TypeBinding } from '../../metadata/models/domain/TypeBinding';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { getBindingOrThrow } from '../../metadata/utils/domain/getBindingOrThrow';
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
