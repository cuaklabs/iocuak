import { jest } from '@jest/globals';

import { ContainerRequestService } from '../../services/ContainerRequestService';

export class ContainerRequestServiceMocks {
  public static get any(): jest.Mocked<ContainerRequestService> {
    const fixture: jest.Mocked<ContainerRequestService> = {
      end: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      start: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerRequestService>
    > as jest.Mocked<ContainerRequestService>;

    return fixture;
  }
}
