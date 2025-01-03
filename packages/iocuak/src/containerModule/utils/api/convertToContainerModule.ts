import { Newable, Tag } from '@cuaklabs/iocuak-common';
import {
  bind,
  BindingService,
  bindToValue,
  ContainerModule,
} from '@cuaklabs/iocuak-core';
import { BindOptionsApi } from '@cuaklabs/iocuak-models-api';

import { convertToBindOptions } from '../../../binding/utils/api/convertToBindOptions';
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
            options?: BindOptionsApi,
          ) => {
            bind(type, convertToBindOptions(options), containerBindingService);
          },
          bindToValue: (options: BindValueOptionsApi): void => {
            bindToValue(
              options.serviceId,
              getTags(options),
              options.value,
              containerBindingService,
            );
          },
        };

      containerModuleApi.load(containerModuleBindingServiceApi);
    },
  };

  return containerModule;
}

function getTags(options: BindValueOptionsApi): Tag[] {
  const tagOrTags: Tag | Tag[] = options.tags ?? [];

  let tags: Tag[];

  if (Array.isArray(tagOrTags)) {
    tags = tagOrTags;
  } else {
    tags = [tagOrTags];
  }

  return tags;
}
