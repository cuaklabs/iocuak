import { ContainerModuleMetadata } from '../../containerModuleMetadata/models/ContainerModuleMetadata';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadContainerModuleMetadata } from './loadContainerModuleMetadata';

export async function loadContainerModuleElementAsync(
  containerModuleMetadata: ContainerModuleMetadata,
  context: LoadModuleMetadataTaskContext,
  loadModuleDependenciesResult: Promise<void>,
): Promise<void> {
  await loadModuleDependenciesResult;

  return loadContainerModuleMetadata(containerModuleMetadata, context);
}
