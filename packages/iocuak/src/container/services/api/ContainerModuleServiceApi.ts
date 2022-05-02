import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleMetadataApi } from '../../../containerModuleMetadata/models/api/ContainerModuleMetadataApi';

export interface ContainerModuleServiceApi {
  load(containerModuleApi: ContainerModuleApi): void;
  loadMetadata(
    containerModuleMetadataApi: ContainerModuleMetadataApi,
  ): Promise<void>;
}
