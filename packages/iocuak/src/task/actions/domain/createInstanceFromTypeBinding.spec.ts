import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./createInstanceInRequestScope');
jest.mock('./createInstanceInSingletonScope');
jest.mock('./createInstanceInTransientScope');

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { TaskContext } from '../../models/domain/TaskContext';
import { createInstanceFromTypeBinding } from './createInstanceFromTypeBinding';
import { createInstanceInRequestScope } from './createInstanceInRequestScope';
import { createInstanceInSingletonScope } from './createInstanceInSingletonScope';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

describe(createInstanceFromTypeBinding.name, () => {
  describe.each<
    [
      string,
      TypeBinding,
      jestMock.Mock<(binding: TypeBinding, context: TaskContext) => unknown>,
    ]
  >([
    [
      'request',
      TypeBindingFixtures.withScopeRequest,
      createInstanceInRequestScope as jestMock.Mock<
        typeof createInstanceInRequestScope
      >,
    ],
    [
      'singleton',
      TypeBindingFixtures.withScopeSingleton,
      createInstanceInSingletonScope as jestMock.Mock<
        typeof createInstanceInSingletonScope
      >,
    ],
    [
      'transient',
      TypeBindingFixtures.withScopeTransient,
      createInstanceInTransientScope as jestMock.Mock<
        typeof createInstanceInTransientScope
      >,
    ],
  ])(
    'having a TypeBinding in % scope',
    (
      _: string,
      typeBindingFixture: TypeBinding,
      functionMock: jestMock.Mock<
        (binding: TypeBinding, context: TaskContext) => unknown
      >,
    ) => {
      describe('when called', () => {
        let taskContextFixture: TaskContext;
        let instanceFixture: unknown;

        let result: unknown;

        beforeAll(() => {
          taskContextFixture = { _type: Symbol() } as unknown as TaskContext;
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
