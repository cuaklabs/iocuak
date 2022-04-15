import { ContainerModuleBindingServiceApi } from '../../services/api/ContainerModuleBindingServiceApi';

export interface ContainerModuleApi {
  load(containerModuleBindingService: ContainerModuleBindingServiceApi): void;
}
