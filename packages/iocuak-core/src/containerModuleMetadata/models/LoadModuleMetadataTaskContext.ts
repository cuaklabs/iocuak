import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { CreateInstanceTaskContext } from '../../createInstanceTask/models/CreateInstanceTaskContext';
import { getContainerModuleMetadataId } from '../calculations/getContainerModuleMetadataId';
import { ContainerModuleMetadata } from './ContainerModuleMetadata';

export class LoadModuleMetadataTaskContext {
  readonly #dependencyIdToDependentMetadataMap: Map<
    ContainerModuleMetadataId,
    ContainerModuleMetadata[]
  >;
  readonly #metadataToDependenciesMap: Map<ContainerModuleMetadata, number>;

  constructor(
    public readonly createInstanceTaskContext: CreateInstanceTaskContext,
    public readonly metadataArray: ContainerModuleMetadata[],
  ) {
    this.#dependencyIdToDependentMetadataMap =
      this.#buildDependencyIdToDependentMetadataMap(this.metadataArray);
    this.#metadataToDependenciesMap = this.#buildMetadataToDependenciesMap(
      this.metadataArray,
    );
  }

  public isMetadataArrayLoadable(): boolean {
    let solvedDependencies: number = 0;

    let dependenciesToSolve: ContainerModuleMetadata[] =
      this.metadataArray.filter(
        (metadata: ContainerModuleMetadata): boolean =>
          metadata.requires.length === 0,
      );

    const metadataToDependenciesMap: Map<ContainerModuleMetadata, number> =
      this.#buildMetadataToDependenciesMap(this.metadataArray);

    while (dependenciesToSolve.length > 0) {
      solvedDependencies += dependenciesToSolve.length;

      dependenciesToSolve = this.#simulateDependenciesLoaded(
        dependenciesToSolve,
        metadataToDependenciesMap,
      );
    }

    return solvedDependencies === this.metadataArray.length;
  }

  public processMetadataLoaded(
    dependency: ContainerModuleMetadata,
  ): ContainerModuleMetadata[] {
    const newDependenciesToSolve: ContainerModuleMetadata[] = [];

    const metadataId: ContainerModuleMetadataId | undefined =
      getContainerModuleMetadataId(dependency);

    if (metadataId !== undefined) {
      const dependentMetadataArray: ContainerModuleMetadata[] | undefined =
        this.#dependencyIdToDependentMetadataMap.get(metadataId);

      if (dependentMetadataArray !== undefined) {
        for (const dependentMetadata of dependentMetadataArray) {
          const dependentMetadataDependencies: number =
            this.#decrementMetadataDependency(
              dependentMetadata,
              this.#metadataToDependenciesMap,
            );

          if (dependentMetadataDependencies === 0) {
            newDependenciesToSolve.push(dependentMetadata);
          }
        }
      }
    }

    return newDependenciesToSolve;
  }

  #buildDependencyIdToDependentMetadataMap(
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
          dependencyIdToDependentMetadataMap.set(
            metadataId,
            metadataArrayEntry,
          );
        }

        metadataArrayEntry.push(metadata);
      }
    }

    return dependencyIdToDependentMetadataMap;
  }

  #buildMetadataToDependenciesMap(
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

  #decrementMetadataDependency(
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

  #simulateDependenciesLoaded(
    dependenciesToSolve: ContainerModuleMetadata[],
    metadataToDependenciesMap: Map<ContainerModuleMetadata, number>,
  ): ContainerModuleMetadata[] {
    const newDependenciesToSolve: ContainerModuleMetadata[] = [];

    for (const metadata of dependenciesToSolve) {
      const metadataId: ContainerModuleMetadataId | undefined =
        getContainerModuleMetadataId(metadata);

      if (metadataId !== undefined) {
        const dependentMetadataArray: ContainerModuleMetadata[] | undefined =
          this.#dependencyIdToDependentMetadataMap.get(metadataId);

        if (dependentMetadataArray !== undefined) {
          for (const dependentMetadata of dependentMetadataArray) {
            const dependentMetadataDependencies: number =
              this.#decrementMetadataDependency(
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
}
