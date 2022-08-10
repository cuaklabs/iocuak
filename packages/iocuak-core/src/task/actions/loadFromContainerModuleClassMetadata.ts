import { BindingService } from '../../binding/services/BindingService';
import { ContainerModule } from '../../containerModule/models/ContainerModule';
import { ContainerModuleClassMetadata } from '../../containerModuleMetadata/models/ContainerModuleClassMetadata';
import { TaskContext } from '../models/TaskContext';
import { createInstance } from './createInstance';

export function loadFromContainerModuleClassMetadata(
  metadata: ContainerModuleClassMetadata,
  context: TaskContext,
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
