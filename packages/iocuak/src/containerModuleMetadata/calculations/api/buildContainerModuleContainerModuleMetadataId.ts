import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { hashString } from '../../../foundation/calculations/hashString';

export function buildContainerModuleContainerModuleMetadataId(
  containerModuleApi: ContainerModuleApi,
): ContainerModuleMetadataId {
  const stringifiedLoadFunction: string = containerModuleApi.load.toString();

  return hashString(stringifiedLoadFunction);
}
