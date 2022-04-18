import { ContainerModuleMetadataApi } from '../../../containerModuleTask/models/api/ContainerModuleMetadataApi';
import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';

export interface ContainerModuleServiceApi {
  load(containerModuleApi: ContainerModuleApi): void;
  loadMetadata(
    containerModuleMetadataApi: ContainerModuleMetadataApi,
  ): Promise<void>;
}
