import { ContainerBindingServiceApi } from './ContainerBindingServiceApi';
import { ContainerInstanceServiceApi } from './ContainerInstanceServiceApi';
import { ContainerModuleServiceApi } from './ContainerModuleServiceApi';

export interface ContainerServiceApi
  extends ContainerBindingServiceApi,
    ContainerInstanceServiceApi,
    ContainerModuleServiceApi {}
