import { BindingService } from '../../binding/services/BindingService';
import { ContainerModule } from '../../containerModule/models/ContainerModule';
import { ContainerModuleClassMetadata } from '../../containerModuleMetadata/models/ContainerModuleClassMetadata';
import { createInstance } from '../../createInstanceTask/actions/createInstance';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';

export function loadFromContainerModuleClassMetadata(
  metadata: ContainerModuleClassMetadata,
  context: LoadModuleMetadataTaskContext,
): void {
  const containerModuleFromMetadata: unknown = createInstance(
    metadata.moduleType,
    context.createInstanceTaskContext,
  );

  const containerModule: ContainerModule = {
    load: (containerBindingService: BindingService): void => {
      metadata.loader(containerModuleFromMetadata, containerBindingService);
    },
  };

  containerModule.load(
    context.createInstanceTaskContext.services.bindingService,
  );
}
