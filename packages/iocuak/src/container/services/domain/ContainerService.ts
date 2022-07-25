import { BindingService } from '../../../binding/services/domain/BindingService';
import { ContainerRequestService } from './ContainerRequestService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: BindingService;
  request: ContainerRequestService;
  singleton: ContainerSingletonService;
}
