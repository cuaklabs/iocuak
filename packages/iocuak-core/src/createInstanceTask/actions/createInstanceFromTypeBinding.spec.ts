import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./createInstanceInRequestScope');
jest.mock('./createInstanceInSingletonScope');
jest.mock('./createInstanceInTransientScope');

import { TypeBinding } from '@cuaklabs/iocuak-models';

import { TypeBindingFixtures } from '../../binding/fixtures/TypeBindingFixtures';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstanceFromTypeBinding } from './createInstanceFromTypeBinding';
import { createInstanceInRequestScope } from './createInstanceInRequestScope';
import { createInstanceInSingletonScope } from './createInstanceInSingletonScope';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

describe(createInstanceFromTypeBinding.name, () => {
  describe.each<
    [
      string,
      TypeBinding,
      jest.Mock<
        (binding: TypeBinding, context: CreateInstanceTaskContext) => unknown
      >,
    ]
  >([
    [
      'request',
      TypeBindingFixtures.withScopeRequest,
      createInstanceInRequestScope as jest.Mock<
        typeof createInstanceInRequestScope
      >,
    ],
    [
      'singleton',
      TypeBindingFixtures.withScopeSingleton,
      createInstanceInSingletonScope as jest.Mock<
        typeof createInstanceInSingletonScope
      >,
    ],
    [
      'transient',
      TypeBindingFixtures.withScopeTransient,
      createInstanceInTransientScope as jest.Mock<
        typeof createInstanceInTransientScope
      >,
    ],
  ])(
    'having a TypeBinding in % scope',
    (
      _: string,
      typeBindingFixture: TypeBinding,
      functionMock: jest.Mock<
        (binding: TypeBinding, context: CreateInstanceTaskContext) => unknown
      >,
    ) => {
      describe('when called', () => {
        let taskContextFixture: CreateInstanceTaskContext;
        let instanceFixture: unknown;

        let result: unknown;

        beforeAll(() => {
          taskContextFixture = {
            _type: Symbol(),
          } as unknown as CreateInstanceTaskContext;
          instanceFixture = Symbol();

          functionMock.mockReturnValueOnce(instanceFixture);

          result = createInstanceFromTypeBinding(
            typeBindingFixture,
            taskContextFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call mock()', () => {
          expect(functionMock).toHaveBeenCalledTimes(1);
          expect(functionMock).toHaveBeenCalledWith(
            typeBindingFixture,
            taskContextFixture,
          );
        });

        it('should return an instance', () => {
          expect(result).toBe(instanceFixture);
        });
      });
    },
  );
});
