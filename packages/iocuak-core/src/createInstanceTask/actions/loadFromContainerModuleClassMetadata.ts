import { BindingService } from '../../binding/services/BindingService';
import { ContainerModule } from '../../containerModule/models/ContainerModule';
import { ContainerModuleClassMetadata } from '../../containerModuleMetadata/models/ContainerModuleClassMetadata';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstance } from './createInstance';

export function loadFromContainerModuleClassMetadata(
  metadata: ContainerModuleClassMetadata,
  context: CreateInstanceTaskContext,
): void {
  const containerModuleFromMetadata: unknown = createInstance(
    metadata.moduleType,
    context,
  );

  const containerModule: ContainerModule = {
    load: (containerBindingService: BindingService): void => {
      metadata.loader(containerModuleFromMetadata, containerBindingService);
    },
  };

  containerModule.load(context.services.bindingService);
}
