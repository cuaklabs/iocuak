import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';
import { ContainerModuleMetadataApi } from './ContainerModuleMetadataApi';

export interface ContainerModuleMetadataBaseApi {
  imports: ContainerModuleMetadataApi<ContainerModuleApi>[];
}
