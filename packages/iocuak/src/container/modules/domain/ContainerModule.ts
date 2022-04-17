import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerBindingService } from '../../services/domain/ContainerBindingService';

export interface ContainerModule {
  load(
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
  ): void;
}
