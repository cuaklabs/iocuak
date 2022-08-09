import { ContainerModuleMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadataType';
import { TaskContext } from '../../models/domain/TaskContext';
import { loadFromContainerModuleClassMetadata } from './loadFromContainerModuleClassMetadata';
import { loadFromContainerModuleFactoryMetadata } from './loadFromContainerModuleFactoryMetadata';

export function loadContainerModuleElement(
  containerModuleMetadata: ContainerModuleMetadata,
  context: TaskContext,
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
