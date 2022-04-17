import { ContainerModuleApi } from '../../container/modules/api/ContainerModuleApi';
import { ContainerModule } from '../../container/modules/domain/ContainerModule';
import { convertToContainerModule } from './convertToContainerModule';

export async function convertToContainerModuleAsync(
  containerModuleApiPromise: Promise<ContainerModuleApi>,
): Promise<ContainerModule> {
  const containerModuleApi: ContainerModuleApi =
    await containerModuleApiPromise;

  return convertToContainerModule(containerModuleApi);
}
