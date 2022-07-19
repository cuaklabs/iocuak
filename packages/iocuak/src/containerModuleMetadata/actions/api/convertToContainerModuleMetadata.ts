import {
  ClassElementMetadata,
  ClassElementMetadataType,
} from '@cuaklabs/iocuak-class-metadata';
import { ServiceId } from '@cuaklabs/iocuak-common';

import { BindingService } from '../../../binding/services/domain/BindingService';
import { ClassElementMetadataApi } from '../../../classMetadata/models/api/ClassElementMetadataApi';
import { convertToClassElementMetadata } from '../../../classMetadata/utils/api/convertToClassElementMetadata';
import { isClassElementMetadataApi } from '../../../classMetadata/utils/api/isClassElementMetadataApi';
import { isFunction } from '../../../common/utils/isFunction';
import { isPromiseLike } from '../../../common/utils/isPromiseLike';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { convertToContainerModule } from '../../../containerModule/utils/api/convertToContainerModule';
import { convertToContainerModuleAsync } from '../../../containerModule/utils/api/convertToContainerModuleAsync';
import { isContainerModuleApi } from '../../../containerModule/utils/api/isContainerModuleApi';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleMetadataApi } from '../../models/api/ContainerModuleMetadataApi';
import { ContainerModuleClassMetadata } from '../../models/domain/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../../models/domain/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../models/domain/ContainerModuleMetadataType';
import { isContainerModuleClassMetadataApi } from './isContainerModuleClassMetadataApi';

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
      imports: convertToContainerModuleMetadataArray(
        containerModuleClassMetadataApi.imports,
      ),
      loader: (
        containerModuleApi: ContainerModuleApi,
        containerBindingService: BindingService,
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
      imports: convertToContainerModuleMetadataArray(
        containerModuleFactoryMetadataApi.imports,
      ),
      injects: convertInjectsToClassElementMetadata(
        containerModuleFactoryMetadataApi,
      ),
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
