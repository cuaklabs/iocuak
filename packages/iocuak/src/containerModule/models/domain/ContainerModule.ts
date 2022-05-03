import { BindingService } from '../../../binding/services/domain/BindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';

export interface ContainerModule {
  load(
    containerBindingService: BindingService,
    metadataService: MetadataService,
  ): void;
}
