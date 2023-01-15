import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { decrementMetadataDependency } from '../actions/decrementMetadataDependency';
import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { buildDependencyIdToDependentMetadataMap } from './buildDependencyIdToDependentMetadataMap';
import { buildMetadataToDependenciesMap } from './buildMetadataToDependenciesMap';
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
