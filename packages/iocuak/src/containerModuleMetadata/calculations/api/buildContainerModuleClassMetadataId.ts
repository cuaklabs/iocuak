import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';

export function buildContainerModuleClassMetadataId(
  metadata: ContainerModuleClassMetadataApi,
): ContainerModuleMetadataId {
  return metadata.module;
}
