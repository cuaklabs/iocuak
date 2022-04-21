import { isPromiseLike } from '@cuaklabs/cuaktask';

import { ContainerModuleApi } from '../../container/modules/api/ContainerModuleApi';
import { ContainerModule } from '../../container/modules/domain/ContainerModule';
import { ContainerModuleMetadataApi } from '../models/api/ContainerModuleMetadataApi';
import { ContainerModuleMetadata } from '../models/domain/ContainerModuleMetadata';
import { convertToContainerModule } from './convertToContainerModule';
import { convertToContainerModuleAsync } from './convertToContainerModuleAsync';

export function convertToContainerModuleMetadata<TArgs extends unknown[]>(
  containerModuleMetadataApi: ContainerModuleMetadataApi<
    ContainerModuleApi,
    TArgs
  >,
): ContainerModuleMetadata<TArgs> {
  const containerModuleMetadata: ContainerModuleMetadata<TArgs> = {
    factory: convertToContainerModuleMetadataFactory(
      containerModuleMetadataApi.factory,
    ),
    imports: containerModuleMetadataApi.imports.map(
      (containerModuleImport: ContainerModuleMetadataApi) =>
        convertToContainerModuleMetadata(containerModuleImport),
    ),
    injects: [...containerModuleMetadataApi.injects],
  };

  return containerModuleMetadata;
}

function convertToContainerModuleMetadataFactory<TArgs extends unknown[]>(
  factoryApi: (
    ...args: TArgs
  ) => ContainerModuleApi | Promise<ContainerModuleApi>,
): (...args: TArgs) => ContainerModule | Promise<ContainerModule> {
  const factory: (
    ...args: TArgs
  ) => ContainerModule | Promise<ContainerModule> = (
    ...args: TArgs
  ): ContainerModule | Promise<ContainerModule> => {
    const containerModuleApi: ContainerModuleApi | Promise<ContainerModuleApi> =
      factoryApi(...args);

    if (isPromiseLike(containerModuleApi)) {
      return convertToContainerModuleAsync(containerModuleApi);
    } else {
      return convertToContainerModule(containerModuleApi);
    }
  };

  return factory;
}
