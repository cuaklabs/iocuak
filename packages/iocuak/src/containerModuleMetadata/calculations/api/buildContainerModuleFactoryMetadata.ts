import {
  ContainerModuleMetadataId,
  isPromiseLike,
  ServiceId,
} from '@cuaklabs/iocuak-common';
import {
  ContainerModule,
  ContainerModuleFactoryMetadata,
  ContainerModuleMetadataType,
} from '@cuaklabs/iocuak-core';
import {
  ClassElementMetadata,
  ClassElementMetadataType,
} from '@cuaklabs/iocuak-models';
import { ClassElementMetadataApi } from '@cuaklabs/iocuak-models-api';

import { convertToClassElementMetadata } from '../../../classMetadata/utils/api/convertToClassElementMetadata';
import { isClassElementMetadataApi } from '../../../classMetadata/utils/api/isClassElementMetadataApi';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { convertToContainerModule } from '../../../containerModule/utils/api/convertToContainerModule';
import { convertToContainerModuleAsync } from '../../../containerModule/utils/api/convertToContainerModuleAsync';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { buildContainerModuleFactoryMetadataId } from './buildContainerModuleFactoryMetadataId';

export function buildContainerModuleFactoryMetadata<TArgs extends unknown[]>(
  containerModuleFactoryMetadataApi: ContainerModuleFactoryMetadataApi<TArgs>,
  requires: ContainerModuleMetadataId[],
): ContainerModuleFactoryMetadata<TArgs> {
  const containerModuleFactoryMetadata: ContainerModuleFactoryMetadata<TArgs> =
    {
      factory: convertToContainerModuleMetadataFactory(
        containerModuleFactoryMetadataApi.factory,
      ),
      id: buildContainerModuleFactoryMetadataId(
        containerModuleFactoryMetadataApi,
      ),
      imports: [],
      injects: convertInjectsToClassElementMetadata(
        containerModuleFactoryMetadataApi,
      ),
      requires,
      type: ContainerModuleMetadataType.factory,
    };

  return containerModuleFactoryMetadata;
}

function convertInjectsToClassElementMetadata<TArgs extends unknown[]>(
  containerModuleFactoryMetadataApi: ContainerModuleFactoryMetadataApi<TArgs>,
): ClassElementMetadata[] {
  const containerModuleFactoryMetadataInjects: (
    | ServiceId
    | ClassElementMetadataApi
  )[] = [...(containerModuleFactoryMetadataApi.injects ?? [])];

  const classElementMetadataArray: ClassElementMetadata[] =
    containerModuleFactoryMetadataInjects.map(
      (
        serviceIdOrClassElementMetadata: ServiceId | ClassElementMetadataApi,
      ): ClassElementMetadata => {
        if (isClassElementMetadataApi(serviceIdOrClassElementMetadata)) {
          return convertToClassElementMetadata(serviceIdOrClassElementMetadata);
        } else {
          return {
            type: ClassElementMetadataType.serviceId,
            value: serviceIdOrClassElementMetadata,
          };
        }
      },
    );

  return classElementMetadataArray;
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
