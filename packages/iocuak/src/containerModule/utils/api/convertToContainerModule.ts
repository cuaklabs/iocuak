import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { Newable } from '../../../common/models/domain/Newable';
import { BindValueOptionsApi } from '../../../container/models/api/BindValueOptionsApi';
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
          bindToValue: (options: BindValueOptionsApi): void =>
            bindToValue(
              options.serviceId,
              getTags(options),
              options.value,
              containerBindingService,
            ),
        };

      containerModuleApi.load(containerModuleBindingServiceApi);
    },
  };

  return containerModule;
}

function getTags(options: BindValueOptionsApi): BindingTag[] {
  const tagOrTags: BindingTag | BindingTag[] = options?.tags ?? [];

  let tags: BindingTag[];

  if (Array.isArray(tagOrTags)) {
    tags = tagOrTags;
  } else {
    tags = [tagOrTags];
  }

  return tags;
}
