import { Newable, Tag } from '@cuaklabs/iocuak-common';
import { BindingService, ContainerModule } from '@cuaklabs/iocuak-core';

import { bind } from '../../../binding/utils/domain/bind';
import { bindToValue } from '../../../binding/utils/domain/bindToValue';
import { BindValueOptionsApi } from '../../../container/models/api/BindValueOptionsApi';
import { ContainerModuleBindingServiceApi } from '../../../container/services/api/ContainerModuleBindingServiceApi';
import { ContainerModuleApi } from '../../models/api/ContainerModuleApi';

export function convertToContainerModule(
  containerModuleApi: ContainerModuleApi,
): ContainerModule {
  const containerModule: ContainerModule = {
    load: (containerBindingService: BindingService): void => {
      const containerModuleBindingServiceApi: ContainerModuleBindingServiceApi =
        {
          bind: <TInstance, TArgs extends unknown[]>(
            type: Newable<TInstance, TArgs>,
          ) => bind(type, containerBindingService),
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

function getTags(options: BindValueOptionsApi): Tag[] {
  const tagOrTags: Tag | Tag[] = options?.tags ?? [];

  let tags: Tag[];

  if (Array.isArray(tagOrTags)) {
    tags = tagOrTags;
  } else {
    tags = [tagOrTags];
  }

  return tags;
}
