import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';

export function buildMetadataToDependenciesMap(
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
