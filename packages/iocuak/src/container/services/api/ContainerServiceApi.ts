import { BindingServiceApi } from '../../../binding/services/api/BindingServiceApi';
import { ContainerInstanceServiceApi } from './ContainerInstanceServiceApi';
import { ContainerModuleServiceApi } from './ContainerModuleServiceApi';

export interface ContainerServiceApi
  extends BindingServiceApi,
    ContainerInstanceServiceApi,
    ContainerModuleServiceApi {}
