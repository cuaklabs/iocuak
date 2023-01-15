import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';

export function decrementMetadataDependency(
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
