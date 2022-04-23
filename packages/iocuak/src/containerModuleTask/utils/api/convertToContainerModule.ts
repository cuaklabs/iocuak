import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';
import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerModuleBindingServiceApi } from '../../../container/services/api/ContainerModuleBindingServiceApi';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { bind } from '../../../container/utils/bind';
import { bindToValue } from '../../../container/utils/bindToValue';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';

export function convertToContainerModule(
  containerModuleApi: ContainerModuleApi,
): ContainerModule {
  const containerModule: ContainerModule = {
    load: (
      containerBindingService: ContainerBindingService,
      metadataService: MetadataService,
    ): void => {
      const containerModuleBindingServiceApi: ContainerModuleBindingServiceApi =
        {
          bind: <TInstance, TArgs extends unknown[]>(
            type: Newable<TInstance, TArgs>,
          ) => bind(type, containerBindingService, metadataService),
          bindToValue: <TInstance>(
            serviceId: ServiceId,
            value: TInstance,
          ): void => bindToValue(serviceId, value, containerBindingService),
        };

      containerModuleApi.load(containerModuleBindingServiceApi);
    },
  };

  return containerModule;
}
