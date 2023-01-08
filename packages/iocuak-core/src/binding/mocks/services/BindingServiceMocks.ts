import { jest } from '@jest/globals';

import { BindingService } from '../../services/BindingService';

export class BindingServiceMocks {
  public static get any(): jest.Mocked<BindingService> {
    const fixture: jest.Mocked<BindingService> = {
      get: jest.fn(),
      getAll: jest.fn(),
      getByTag: jest.fn(),
      remove: jest.fn(),
      set: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;

    return fixture;
  }
}
