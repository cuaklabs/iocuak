import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { getContainerModuleMetadataId } from './getContainerModuleMetadataId';

export function createContainerModuleMetadataMap(
  containerModuleMetadataArray: ContainerModuleMetadata[],
): Map<ContainerModuleMetadataId, ContainerModuleMetadata> {
  const containerModuleIdAndMetadataPairArray: [
    ContainerModuleMetadataId,
    ContainerModuleMetadata,
  ][] = createContainerModuleIdAndMetadataPairArray(
    containerModuleMetadataArray,
  );

  const containerModuleMetadataIdToContainerModuleMetadataMap: Map<
    ContainerModuleMetadataId,
    ContainerModuleMetadata
  > = new Map(containerModuleIdAndMetadataPairArray);

  return containerModuleMetadataIdToContainerModuleMetadataMap;
}

function createContainerModuleIdAndMetadataPairArray(
  containerModuleMetadataArray: ContainerModuleMetadata[],
): [ContainerModuleMetadataId, ContainerModuleMetadata][] {
  const containerModuleIdAndMetadataPairArray: [
    ContainerModuleMetadataId,
    ContainerModuleMetadata,
  ][] = containerModuleMetadataArray
    .map(
      (
        containerModuleMetadata: ContainerModuleMetadata,
      ): [ContainerModuleMetadataId | undefined, ContainerModuleMetadata] => [
        getContainerModuleMetadataId(containerModuleMetadata),
        containerModuleMetadata,
      ],
    )
    .filter(isContainerModuleIdAndMetadataPair);

  return containerModuleIdAndMetadataPairArray;
}

function isContainerModuleIdAndMetadataPair(
  containerModuleIdAndMetadataPair: [
    ContainerModuleMetadataId | undefined,
    ContainerModuleMetadata,
  ],
): containerModuleIdAndMetadataPair is [
  ContainerModuleMetadataId,
  ContainerModuleMetadata,
] {
  const [containerModuleMetadataId]: [
    ContainerModuleMetadataId | undefined,
    ContainerModuleMetadata,
  ] = containerModuleIdAndMetadataPair;
  return containerModuleMetadataId !== undefined;
}
