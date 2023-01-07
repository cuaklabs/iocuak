import { jest } from '@jest/globals';

import { ContainerSingletonService } from '../../services/ContainerSingletonService';

export class ContainerSingletonServiceMocks {
  public static get any(): jest.Mocked<ContainerSingletonService> {
    const fixture: jest.Mocked<ContainerSingletonService> = {
      get: jest.fn(),
      remove: jest.fn(),
      set: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerSingletonService>
    > as jest.Mocked<ContainerSingletonService>;

    return fixture;
  }
}
