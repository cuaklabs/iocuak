import { ContainerApiService } from '../../services/api/ContainerApiService';

export interface ContainerModuleApi {
  load(container: ContainerApiService): void;
}
