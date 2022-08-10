import { ContainerModuleMetadata } from '../../containerModuleMetadata/models/ContainerModuleMetadata';
import { TaskContext } from '../models/TaskContext';
import { loadContainerModuleElement } from './loadContainerModuleElement';

export async function loadContainerModuleElementAsync(
  containerModuleMetadata: ContainerModuleMetadata,
  context: TaskContext,
  loadModuleDependenciesResult: Promise<void>,
): Promise<void> {
  await loadModuleDependenciesResult;

  return loadContainerModuleElement(containerModuleMetadata, context);
}
