import { beforeAll, describe, expect, it } from '@jest/globals';

import { createInstanceFromBinding } from '../actions/createInstanceFromBinding';
import { getDependencies } from '../actions/getDependencies';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { TaskContextServices } from '../models/TaskContextServices';
import { createInstanceTaskContext } from './createInstanceTaskContext';

describe(createInstanceTaskContext.name, () => {
  let requestIdFixture: symbol;
  let servicesFixture: TaskContextServices;

  beforeAll(() => {
    requestIdFixture = Symbol();
    servicesFixture = Symbol() as unknown as TaskContextServices;
  });

  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = createInstanceTaskContext(requestIdFixture, servicesFixture);
    });

    it('should return a CreateInstanceTaskContext', () => {
      const expected: CreateInstanceTaskContext = {
        actions: {
          createInstanceFromBinding,
          getDependencies,
        },
        requestId: requestIdFixture,
        services: servicesFixture,
        servicesInstantiatedSet: new Set(),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
