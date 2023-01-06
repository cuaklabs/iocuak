import { ContainerModuleMetadata } from '../../containerModuleMetadata/models/ContainerModuleMetadata';
import { CreateInstanceTaskContext } from '../../createInstanceTask/models/CreateInstanceTaskContext';
import { loadContainerModuleElement } from './loadContainerModuleElement';

export async function loadContainerModuleElementAsync(
  containerModuleMetadata: ContainerModuleMetadata,
  context: CreateInstanceTaskContext,
  loadModuleDependenciesResult: Promise<void>,
): Promise<void> {
  await loadModuleDependenciesResult;

  return loadContainerModuleElement(containerModuleMetadata, context);
}
