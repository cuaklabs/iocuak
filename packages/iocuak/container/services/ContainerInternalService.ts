import { ContainerBindingInternalService } from './ContainerBindingInternalService';
import { ContainerSingletonInternalService } from './ContainerSingletonInternalService';

export interface ContainerInternalService {
  binding: ContainerBindingInternalService;
  singleton: ContainerSingletonInternalService;
}
