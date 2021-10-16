import { ContainerBindingService } from './ContainerBindingService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: ContainerBindingService;
  singleton: ContainerSingletonService;
}
