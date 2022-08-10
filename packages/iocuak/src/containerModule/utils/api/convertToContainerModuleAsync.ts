import { ContainerModule } from '@cuaklabs/iocuak-core';

import { ContainerModuleApi } from '../../models/api/ContainerModuleApi';
import { convertToContainerModule } from './convertToContainerModule';

export async function convertToContainerModuleAsync(
  containerModuleApiPromise: Promise<ContainerModuleApi>,
): Promise<ContainerModule> {
  const containerModuleApi: ContainerModuleApi =
    await containerModuleApiPromise;

  return convertToContainerModule(containerModuleApi);
}
