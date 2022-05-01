import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';

export interface ContainerModule {
  load(
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
  ): void;
}
