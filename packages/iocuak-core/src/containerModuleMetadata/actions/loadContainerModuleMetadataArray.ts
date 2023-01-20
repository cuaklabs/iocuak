import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadContainerModuleMetadata } from './loadContainerModuleMetadata';

export async function loadContainerModuleMetadataArray(
  context: LoadModuleMetadataTaskContext,
): Promise<void> {
  if (!context.isMetadataArrayLoadable()) {
    throw new Error(
      'Metadata provided is not loadable. Ensure all the container module metadata ids are correctly referenced and there are no circular references',
    );
  }

  const metadataLoadedPromises: Promise<void>[] = [];

  const metadataArrayToLoad: ContainerModuleMetadata[] =
    context.getZeroDependenciesMetadata();

  handleMetadataLoad(metadataArrayToLoad, context, metadataLoadedPromises);

  while (metadataLoadedPromises.length > 0) {
    const metadataLoadedTopPromise: Promise<void> =
      metadataLoadedPromises.pop() as Promise<void>;

    await metadataLoadedTopPromise;
  }
}

function handleMetadataLoad(
  metadataArray: ContainerModuleMetadata[],
  context: LoadModuleMetadataTaskContext,
  metadataLoadedPromises: Promise<void>[],
): void {
  if (metadataArray.length > 0) {
    const metadataLoadedPromise: Promise<void> = (async () => {
      await Promise.all(
        metadataArray.map(async (metadata: ContainerModuleMetadata) => {
          await loadContainerModuleMetadata(metadata, context);

          context.processMetadataLoaded(metadata);

          const metadataArrayToLoad: ContainerModuleMetadata[] =
            context.getZeroDependenciesMetadata();

          handleMetadataLoad(
            metadataArrayToLoad,
            context,
            metadataLoadedPromises,
          );
        }),
      );
    })();

    metadataLoadedPromises.push(metadataLoadedPromise);
  }
}
