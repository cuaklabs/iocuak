import { BindingService } from '../../binding/services/BindingService';
import { ContainerRequestService } from '../../container/services/ContainerRequestService';
import { ContainerSingletonService } from '../../container/services/ContainerSingletonService';

export interface TaskContextServices {
  bindingService: BindingService;
  containerRequestService: ContainerRequestService;
  containerSingletonService: ContainerSingletonService;
}
