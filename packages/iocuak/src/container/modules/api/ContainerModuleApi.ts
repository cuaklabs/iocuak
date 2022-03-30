import { ContainerModuleBindingServiceApi } from '../../services/api/ContainerModuleBindingServiceApi';

export interface ContainerModuleApi {
  load(
    containerModuleBindingServiceApi: ContainerModuleBindingServiceApi,
  ): void;
}
