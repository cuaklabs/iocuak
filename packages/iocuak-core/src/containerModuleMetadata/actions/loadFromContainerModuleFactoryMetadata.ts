import { isPromiseLike } from '@cuaklabs/iocuak-common';
import { ClassElementMetadata } from '@cuaklabs/iocuak-models';

import { ContainerModule } from '../../containerModule/models/ContainerModule';
import { ContainerModuleFactoryMetadata } from '../../containerModuleMetadata/models/ContainerModuleFactoryMetadata';
import { getDependency } from '../../createInstanceTask/actions/getDependency';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';

export function loadFromContainerModuleFactoryMetadata(
  metadata: ContainerModuleFactoryMetadata,
  context: LoadModuleMetadataTaskContext,
): void | Promise<void> {
  const instances: unknown[] = metadata.injects.map(
    (inject: ClassElementMetadata) =>
      getDependency(inject, {
        ...context.createInstanceTaskContext,
        servicesInstantiatedSet: new Set(),
      }),
  );

  const containerModule: ContainerModule | Promise<ContainerModule> =
    metadata.factory(...instances);

  if (isPromiseLike(containerModule)) {
    return loadModuleAsync(containerModule, context);
  } else {
    containerModule.load(
      context.createInstanceTaskContext.services.bindingService,
    );
  }
}

async function loadModuleAsync(
  containerModulePromise: Promise<ContainerModule>,
  context: LoadModuleMetadataTaskContext,
): Promise<void> {
  const containerModule: ContainerModule = await containerModulePromise;

  containerModule.load(
    context.createInstanceTaskContext.services.bindingService,
  );
}
