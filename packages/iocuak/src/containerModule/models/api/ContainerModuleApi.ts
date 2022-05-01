import { ContainerModuleBindingServiceApi } from '../../../container/services/api/ContainerModuleBindingServiceApi';

export interface ContainerModuleApi {
  load(containerModuleBindingService: ContainerModuleBindingServiceApi): void;
}
