import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';

export interface ContainerModuleServiceApi {
  load(containerModuleApi: ContainerModuleApi): void;
}
