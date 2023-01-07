import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../models/ContainerModuleMetadataType';

export function getContainerModuleMetadataId(
  metadata: ContainerModuleMetadata,
): ContainerModuleMetadataId | undefined {
  let metadataId: ContainerModuleMetadataId | undefined = metadata.id;

  if (
    metadataId === undefined &&
    metadata.type === ContainerModuleMetadataType.clazz
  ) {
    metadataId = metadata.moduleType;
  }

  return metadataId;
}
