import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';

export interface ContainerModuleApiService {
  load(containerModuleApi: ContainerModuleApi): void;
}
