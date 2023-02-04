import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';
import {
  BindingService,
  ContainerModule,
  ContainerModuleClassMetadata,
  ContainerModuleMetadataType,
} from '@cuaklabs/iocuak-core';

import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { convertToContainerModule } from '../../../containerModule/utils/api/convertToContainerModule';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { buildContainerModuleClassMetadataId } from './buildContainerModuleClassMetadataId';

export function buildContainerModuleClassMetadata(
  containerModuleClassMetadataApi: ContainerModuleClassMetadataApi,
  requires: ContainerModuleMetadataId[],
): ContainerModuleClassMetadata {
  const containerModuleClassMetadata: ContainerModuleClassMetadata<ContainerModuleApi> =
    {
      id: buildContainerModuleClassMetadataId(containerModuleClassMetadataApi),
      loader: (
        containerModuleApi: ContainerModuleApi,
        bindingService: BindingService,
      ) => {
        const containerModule: ContainerModule =
          convertToContainerModule(containerModuleApi);

        containerModule.load(bindingService);
      },
      moduleType: containerModuleClassMetadataApi.module,
      requires,
      type: ContainerModuleMetadataType.clazz,
    };

  return containerModuleClassMetadata as ContainerModuleClassMetadata;
}
