import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { getContainerModuleMetadataId } from './getContainerModuleMetadataId';

export function isMetadataArrayLoadable(
  metadataArray: ContainerModuleMetadata[],
): boolean {
  const metadataToDependenciesMap: Map<ContainerModuleMetadata, number> =
    buildMetadataToDependenciesMap(metadataArray);

  const dependencyIdToDependentMetadataMap: Map<
    ContainerModuleMetadataId,
    ContainerModuleMetadata[]
  > = buildDependencyIdToDependentMetadataMap(metadataArray);

  let solvedDependencies: number = 0;

  let dependenciesToSolve: ContainerModuleMetadata[] = metadataArray.filter(
    (metadata: ContainerModuleMetadata): boolean =>
      metadata.requires.length === 0,
  );

  while (dependenciesToSolve.length > 0) {
    solvedDependencies += dependenciesToSolve.length;

    dependenciesToSolve = simulateDependenciesLoaded(
      dependenciesToSolve,
      metadataToDependenciesMap,
      dependencyIdToDependentMetadataMap,
    );
  }

  return solvedDependencies === metadataArray.length;
}

function buildMetadataToDependenciesMap(
  metadataArray: ContainerModuleMetadata[],
): Map<ContainerModuleMetadata, number> {
  const metadataToDependenciesMap: Map<ContainerModuleMetadata, number> =
    new Map();

  for (const metadata of metadataArray) {
    const dependencies: number = metadata.requires.length;

    metadataToDependenciesMap.set(metadata, dependencies);
  }

  return metadataToDependenciesMap;
}

function buildDependencyIdToDependentMetadataMap(
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

function decrementMetadataDependency(
  metadata: ContainerModuleMetadata,
  metadataToDependenciesMap: Map<ContainerModuleMetadata, number>,
): number {
  let metadataDependencies: number = metadataToDependenciesMap.get(
    metadata,
  ) as number;

  metadataDependencies -= 1;

  metadataToDependenciesMap.set(metadata, metadataDependencies);

  return metadataDependencies;
}

function simulateDependenciesLoaded(
  dependenciesToSolve: ContainerModuleMetadata[],
  metadataToDependenciesMap: Map<ContainerModuleMetadata, number>,
  dependencyIdToDependentMetadataMap: Map<
    ContainerModuleMetadataId,
    ContainerModuleMetadata[]
  >,
): ContainerModuleMetadata[] {
  const newDependenciesToSolve: ContainerModuleMetadata[] = [];

  for (const metadata of dependenciesToSolve) {
    const metadataId: ContainerModuleMetadataId | undefined =
      getContainerModuleMetadataId(metadata);

    if (metadataId !== undefined) {
      const dependentMetadataArray: ContainerModuleMetadata[] | undefined =
        dependencyIdToDependentMetadataMap.get(metadataId);

      if (dependentMetadataArray !== undefined) {
        for (const dependentMetadata of dependentMetadataArray) {
          const dependentMetadataDependencies: number =
            decrementMetadataDependency(
              dependentMetadata,
              metadataToDependenciesMap,
            );

          if (dependentMetadataDependencies === 0) {
            newDependenciesToSolve.push(dependentMetadata);
          }
        }
      }
    }
  }

  return newDependenciesToSolve;
}
