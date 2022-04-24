import { isPromiseLike } from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';
import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleMetadataApi } from '../../models/api/ContainerModuleMetadataApi';
import { ContainerModuleClassMetadata } from '../../models/domain/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../../models/domain/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../models/domain/ContainerModuleMetadataType';
import { convertToContainerModule } from './convertToContainerModule';
import { convertToContainerModuleAsync } from './convertToContainerModuleAsync';
import { isContainerModuleClassMetadataApi } from './isContainerModuleClassMetadataApi';

export function convertToContainerModuleMetadata<TArgs extends unknown[]>(
  containerModuleMetadataApi: ContainerModuleMetadataApi<TArgs>,
): ContainerModuleMetadata<TArgs> {
  let containerModuleMetadata: ContainerModuleMetadata<TArgs>;

  if (isContainerModuleClassMetadataApi(containerModuleMetadataApi)) {
    containerModuleMetadata = convertToContainerModuleClassMetadata(
      containerModuleMetadataApi,
    );
  } else {
    containerModuleMetadata = convertToContainerModuleFactoryMetadata(
      containerModuleMetadataApi,
    );
  }

  return containerModuleMetadata;
}

function convertToContainerModuleClassMetadata(
  containerModuleClassMetadataApi: ContainerModuleClassMetadataApi,
): ContainerModuleClassMetadata {
  const containerModuleClassMetadata: ContainerModuleClassMetadata<ContainerModuleApi> =
    {
      imports: containerModuleClassMetadataApi.imports.map(
        (containerModuleImport: ContainerModuleMetadataApi) =>
          convertToContainerModuleMetadata(containerModuleImport),
      ),
      loader: (
        containerModuleApi: ContainerModuleApi,
        containerBindingService: ContainerBindingService,
        metadataService: MetadataService,
      ) => {
        const containerModule: ContainerModule =
          convertToContainerModule(containerModuleApi);

        containerModule.load(containerBindingService, metadataService);
      },
      moduleType: containerModuleClassMetadataApi.module,
      type: ContainerModuleMetadataType.clazz,
    };

  return containerModuleClassMetadata as ContainerModuleClassMetadata;
}

function convertToContainerModuleFactoryMetadata<TArgs extends unknown[]>(
  containerModuleFactoryMetadataApi: ContainerModuleFactoryMetadataApi<TArgs>,
): ContainerModuleFactoryMetadata<TArgs> {
  const containerModuleFactoryMetadataInjects: ServiceId[] = [
    ...(containerModuleFactoryMetadataApi.injects ?? []),
  ];

  const containerModuleFactoryMetadata: ContainerModuleFactoryMetadata<TArgs> =
    {
      factory: convertToContainerModuleMetadataFactory(
        containerModuleFactoryMetadataApi.factory,
      ),
      imports: containerModuleFactoryMetadataApi.imports.map(
        (containerModuleImport: ContainerModuleMetadataApi) =>
          convertToContainerModuleMetadata(containerModuleImport),
      ),
      injects: containerModuleFactoryMetadataInjects,
      type: ContainerModuleMetadataType.factory,
    };

  return containerModuleFactoryMetadata;
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
