import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';

export function buildContainerModuleClassMetadataId(
  metadata: ContainerModuleClassMetadataApi,
): ContainerModuleMetadataId {
  let metadataId: ContainerModuleMetadataId;

  if (metadata.id === undefined) {
    metadataId = metadata.module;
  } else {
    metadataId = metadata.id;
  }
  return metadataId;
}
