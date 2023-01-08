import { jest } from '@jest/globals';

import { ServiceId } from '@cuaklabs/iocuak-common';

import { CreateInstanceTaskContext } from '../../models/CreateInstanceTaskContext';
import { TaskContextServicesMocks } from './TaskContextServicesMocks';

export class CreateInstanceTaskContextMocks {
  static #requestIdFixture: symbol = Symbol();

  public static get any(): jest.Mocked<CreateInstanceTaskContext> {
    const fixture: jest.Mocked<CreateInstanceTaskContext> = {
      actions: {
        createInstanceFromBinding: jest.fn(),
        getDependencies: jest.fn(),
      },
      requestId: CreateInstanceTaskContextMocks.#requestIdFixture,
      services: TaskContextServicesMocks.any,
      servicesInstantiatedSet: new Set() as Set<ServiceId> &
        jest.Mocked<Set<ServiceId>>,
    };

    return fixture;
  }
}
