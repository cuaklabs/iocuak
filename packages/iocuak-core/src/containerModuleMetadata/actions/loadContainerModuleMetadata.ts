import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../models/ContainerModuleMetadataType';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadFromContainerModuleClassMetadata } from './loadFromContainerModuleClassMetadata';
import { loadFromContainerModuleFactoryMetadata } from './loadFromContainerModuleFactoryMetadata';

export function loadContainerModuleMetadata(
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
