import { jest } from '@jest/globals';

import { BindingServiceMocks } from '../../../binding/mocks/services/BindingServiceMocks';
import { ContainerRequestServiceMocks } from '../../../container/mocks/services/ContainerRequestServiceMocks';
import { ContainerSingletonServiceMocks } from '../../../container/mocks/services/ContainerSingletonServiceMocks';
import { TaskContextServices } from '../../models/TaskContextServices';

export class TaskContextServicesMocks {
  public static get any(): jest.Mocked<TaskContextServices> {
    const fixture: jest.Mocked<TaskContextServices> = {
      bindingService: BindingServiceMocks.any,
      containerRequestService: ContainerRequestServiceMocks.any,
      containerSingletonService: ContainerSingletonServiceMocks.any,
    };

    return fixture;
  }
}
