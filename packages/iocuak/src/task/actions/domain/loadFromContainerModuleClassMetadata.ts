import { BindingService } from '../../../binding/services/domain/BindingService';
import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { ContainerModuleClassMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleClassMetadata';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { TaskContext } from '../../models/domain/TaskContext';
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
    load: (
      containerBindingService: BindingService,
      metadataService: MetadataService,
    ): void => {
      metadata.loader(
        containerModuleFromMetadata,
        containerBindingService,
        metadataService,
      );
    },
  };

  containerModule.load(
    context.services.bindingService,
    context.services.metadataService,
  );
}
