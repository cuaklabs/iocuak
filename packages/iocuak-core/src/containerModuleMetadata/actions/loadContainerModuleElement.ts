import { ContainerModuleMetadata } from '../../containerModuleMetadata/models/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../containerModuleMetadata/models/ContainerModuleMetadataType';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadFromContainerModuleClassMetadata } from './loadFromContainerModuleClassMetadata';
import { loadFromContainerModuleFactoryMetadata } from './loadFromContainerModuleFactoryMetadata';

export function loadContainerModuleElement(
  containerModuleMetadata: ContainerModuleMetadata,
  context: LoadModuleMetadataTaskContext,
): void | Promise<void> {
  let loadContainerModuleResult: void | Promise<void>;

  switch (containerModuleMetadata.type) {
    case ContainerModuleMetadataType.factory:
      loadContainerModuleResult = loadFromContainerModuleFactoryMetadata(
        containerModuleMetadata,
        context,
      );
      break;
    case ContainerModuleMetadataType.clazz:
      loadContainerModuleResult = loadFromContainerModuleClassMetadata(
        containerModuleMetadata,
        context,
      );
      break;
  }

  return loadContainerModuleResult;
}
