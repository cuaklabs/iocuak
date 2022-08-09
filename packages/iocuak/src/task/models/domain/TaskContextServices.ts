import {
  BindingService,
  ContainerRequestService,
  ContainerSingletonService,
} from '@cuaklabs/iocuak-core';

export interface TaskContextServices {
  bindingService: BindingService;
  containerRequestService: ContainerRequestService;
  containerSingletonService: ContainerSingletonService;
}
