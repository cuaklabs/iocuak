import {
  BindingService,
  ContainerRequestService,
  ContainerSingletonService,
} from '@cuaklabs/iocuak-core';

export interface ContainerService {
  binding: BindingService;
  request: ContainerRequestService;
  singleton: ContainerSingletonService;
}
