import { BindingService } from '../../../binding/services/domain/BindingService';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';

export interface TaskContextServices {
  bindingService: BindingService;
  containerRequestService: ContainerRequestService;
  containerSingletonService: ContainerSingletonService;
}
