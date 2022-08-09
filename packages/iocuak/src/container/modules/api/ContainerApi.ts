import {
  BindingService,
  BindingServiceImplementation,
  ContainerRequestService,
  ContainerRequestServiceImplementation,
  ContainerSingletonService,
  ContainerSingletonServiceImplementation,
} from '@cuaklabs/iocuak-core';

import { ContainerServiceApiImplementation } from '../../services/api/ContainerServiceApiImplementation';
import { ContainerService } from '../../services/domain/ContainerService';

export class ContainerApi extends ContainerServiceApiImplementation {
  private constructor(containerService?: ContainerService) {
    super(containerService ?? ContainerApi.#initializeContainerService());
  }

  public static build(): ContainerApi {
    const containerApi: ContainerApi = new ContainerApi();

    return containerApi;
  }

  static #initializeContainerService(
    parentContainerBindingService?: BindingService,
  ): ContainerService {
    const containerBindingService: BindingService =
      new BindingServiceImplementation(parentContainerBindingService);
    const containerRequestService: ContainerRequestService =
      new ContainerRequestServiceImplementation();
    const containerSingletonService: ContainerSingletonService =
      new ContainerSingletonServiceImplementation();

    const containerService: ContainerService = {
      binding: containerBindingService,
      request: containerRequestService,
      singleton: containerSingletonService,
    };

    return containerService;
  }

  public createChild(): ContainerApi {
    const childContainerService: ContainerService =
      ContainerApi.#initializeContainerService(this._containerService.binding);
    const childContainerApi: ContainerApi = new ContainerApi(
      childContainerService,
    );

    return childContainerApi;
  }
}
