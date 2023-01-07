import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { createInstanceTaskContext } from '../../createInstanceTask/calculations/createInstanceTaskContext';
import { CreateInstanceTaskContext } from '../../createInstanceTask/models/CreateInstanceTaskContext';
import { TaskContextServices } from '../../createInstanceTask/models/TaskContextServices';
import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { getContainerModuleMetadataId } from './getContainerModuleMetadataId';

export function createLoadModuleMetadataTaskContext(
  requestId: symbol,
  services: TaskContextServices,
  containerModuleMetadataArray: ContainerModuleMetadata[],
): LoadModuleMetadataTaskContext {
  const createInstanceContext: CreateInstanceTaskContext =
    createInstanceTaskContext(requestId, services);

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

  return {
    ...createInstanceContext,
    containerModuleMetadataIdToContainerModuleMetadataMap,
    containerModulesLoadedSet: new Set(),
  };
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
