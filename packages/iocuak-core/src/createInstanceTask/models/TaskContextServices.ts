import { BindingService } from '../../binding/services/BindingService';
import { ContainerRequestService } from '../../container/services/ContainerRequestService';
import { ContainerSingletonService } from '../../container/services/ContainerSingletonService';

export interface TaskContextServices {
  readonly bindingService: BindingService;
  readonly containerRequestService: ContainerRequestService;
  readonly containerSingletonService: ContainerSingletonService;
}
