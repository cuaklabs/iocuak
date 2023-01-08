import { ContainerModuleMetadata } from '../../containerModuleMetadata/models/ContainerModuleMetadata';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadContainerModuleElement } from './loadContainerModuleElement';

export async function loadContainerModuleElementAsync(
  containerModuleMetadata: ContainerModuleMetadata,
  context: LoadModuleMetadataTaskContext,
  loadModuleDependenciesResult: Promise<void>,
): Promise<void> {
  await loadModuleDependenciesResult;

  return loadContainerModuleElement(containerModuleMetadata, context);
}
