import { isFunction, isPromiseLike, ServiceId } from '@cuaklabs/iocuak-common';
import {
  BindingService,
  ContainerModule,
  ContainerModuleClassMetadata,
  ContainerModuleFactoryMetadata,
  ContainerModuleMetadata,
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
import { isContainerModuleApi } from '../../../containerModule/utils/api/isContainerModuleApi';
import { buildContainerModuleClassMetadataId } from '../../calculations/api/buildContainerModuleClassMetadataId';
import { buildContainerModuleFactoryMetadataId } from '../../calculations/api/buildContainerModuleFactoryMetadataId';
import { isContainerModuleClassMetadataApi } from '../../calculations/api/isContainerModuleClassMetadataApi';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleMetadataApi } from '../../models/api/ContainerModuleMetadataApi';

export function convertToContainerModuleMetadata<TArgs extends unknown[]>(
  containerModuleMetadataApi: ContainerModuleMetadataApi<TArgs>,
): ContainerModuleMetadata<TArgs> {
  let containerModuleMetadata: ContainerModuleMetadata<TArgs>;

  if (isFunction(containerModuleMetadataApi)) {
    containerModuleMetadata = convertToContainerModuleClassMetadata({
      module: containerModuleMetadataApi,
    });
  } else {
    if (isContainerModuleApi(containerModuleMetadataApi)) {
      containerModuleMetadata = convertToContainerModuleFactoryMetadata({
        factory: () => containerModuleMetadataApi,
      });
    } else {
      if (isContainerModuleClassMetadataApi(containerModuleMetadataApi)) {
        containerModuleMetadata = convertToContainerModuleClassMetadata(
          containerModuleMetadataApi,
        );
      } else {
        containerModuleMetadata = convertToContainerModuleFactoryMetadata(
          containerModuleMetadataApi,
        );
      }
    }
  }

  return containerModuleMetadata;
}

function convertToContainerModuleClassMetadata(
  containerModuleClassMetadataApi: ContainerModuleClassMetadataApi,
): ContainerModuleClassMetadata {
  const containerModuleClassMetadata: ContainerModuleClassMetadata<ContainerModuleApi> =
    {
      id: buildContainerModuleClassMetadataId(containerModuleClassMetadataApi),
      imports: convertToContainerModuleMetadataArray(
        containerModuleClassMetadataApi.imports,
      ),
      loader: (
        containerModuleApi: ContainerModuleApi,
        containerBindingService: BindingService,
      ) => {
        const containerModule: ContainerModule =
          convertToContainerModule(containerModuleApi);

        containerModule.load(containerBindingService);
      },
      moduleType: containerModuleClassMetadataApi.module,
      requires: [],
      type: ContainerModuleMetadataType.clazz,
    };

  return containerModuleClassMetadata as ContainerModuleClassMetadata;
}

function convertToContainerModuleMetadataArray(
  containerModuleMetadataApiImports: ContainerModuleMetadataApi[] | undefined,
): ContainerModuleMetadata[] {
  let containerModuleMetadataArray: ContainerModuleMetadata[];

  if (containerModuleMetadataApiImports === undefined) {
    containerModuleMetadataArray = [];
  } else {
    containerModuleMetadataArray = containerModuleMetadataApiImports.map(
      (containerModuleImport: ContainerModuleMetadataApi) =>
        convertToContainerModuleMetadata(containerModuleImport),
    );
  }

  return containerModuleMetadataArray;
}

function convertToContainerModuleFactoryMetadata<TArgs extends unknown[]>(
  containerModuleFactoryMetadataApi: ContainerModuleFactoryMetadataApi<TArgs>,
): ContainerModuleFactoryMetadata<TArgs> {
  const containerModuleFactoryMetadata: ContainerModuleFactoryMetadata<TArgs> =
    {
      factory: convertToContainerModuleMetadataFactory(
        containerModuleFactoryMetadataApi.factory,
      ),
      id: buildContainerModuleFactoryMetadataId(
        containerModuleFactoryMetadataApi,
      ),
      imports: convertToContainerModuleMetadataArray(
        containerModuleFactoryMetadataApi.imports,
      ),
      injects: convertInjectsToClassElementMetadata(
        containerModuleFactoryMetadataApi,
      ),
      requires: [],
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
