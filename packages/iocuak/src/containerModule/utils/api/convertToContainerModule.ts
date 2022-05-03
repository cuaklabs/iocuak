import { BindingService } from '../../../binding/services/domain/BindingService';
import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleBindingServiceApi } from '../../../container/services/api/ContainerModuleBindingServiceApi';
import { bind } from '../../../container/utils/bind';
import { bindToValue } from '../../../container/utils/bindToValue';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleApi } from '../../models/api/ContainerModuleApi';
import { ContainerModule } from '../../models/domain/ContainerModule';

export function convertToContainerModule(
  containerModuleApi: ContainerModuleApi,
): ContainerModule {
  const containerModule: ContainerModule = {
    load: (
      containerBindingService: BindingService,
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
