import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';

export function buildDependencyIdToDependentMetadataMap(
  metadataArray: ContainerModuleMetadata[],
): Map<ContainerModuleMetadataId, ContainerModuleMetadata[]> {
  const dependencyIdToDependentMetadataMap: Map<
    ContainerModuleMetadataId,
    ContainerModuleMetadata[]
  > = new Map();

  for (const metadata of metadataArray) {
    for (const metadataId of metadata.requires) {
      let metadataArrayEntry: ContainerModuleMetadata[] | undefined =
        dependencyIdToDependentMetadataMap.get(metadataId);

      if (metadataArrayEntry === undefined) {
        metadataArrayEntry = [];
        dependencyIdToDependentMetadataMap.set(metadataId, metadataArrayEntry);
      }

      metadataArrayEntry.push(metadata);
    }
  }

  return dependencyIdToDependentMetadataMap;
}
