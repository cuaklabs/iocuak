import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('./createInstanceFromTypeBinding');

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../../binding/models/domain/ValueBinding';
import { TaskContext } from '../../models/domain/TaskContext';
import { createInstanceFromBinding } from './createInstanceFromBinding';
import { createInstanceFromTypeBinding } from './createInstanceFromTypeBinding';

describe(createInstanceFromBinding.name, () => {
  describe('having a TypeBinding', () => {
    let typeBindingFixture: TypeBinding;

    beforeAll(() => {
      typeBindingFixture = TypeBindingFixtures.any;
    });

    describe('when called', () => {
      let taskContextFixture: TaskContext;
      let instanceFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        taskContextFixture = { _type: Symbol() } as unknown as TaskContext;
        instanceFixture = Symbol();

        (
          createInstanceFromTypeBinding as jestMock.Mock<
            typeof createInstanceFromTypeBinding
          >
        ).mockReturnValueOnce(instanceFixture);

        result = createInstanceFromBinding(
          typeBindingFixture,
          taskContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createInstanceFromTypeBinding()', () => {
        expect(createInstanceFromTypeBinding).toHaveBeenCalledTimes(1);
        expect(createInstanceFromTypeBinding).toHaveBeenCalledWith(
          typeBindingFixture,
          taskContextFixture,
        );
      });

      it('should return an instance', () => {
        expect(result).toBe(instanceFixture);
      });
    });
  });

  describe('having a ValueBinding', () => {
    let valueBindingFixture: ValueBinding;

    beforeAll(() => {
      valueBindingFixture = ValueBindingFixtures.any;
    });

    describe('when called', () => {
      let taskContextFixture: TaskContext;

      let result: unknown;

      beforeAll(() => {
        taskContextFixture = { _type: Symbol() } as unknown as TaskContext;

        result = createInstanceFromBinding(
          valueBindingFixture,
          taskContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return an instance', () => {
        expect(result).toBe(valueBindingFixture.value);
      });
    });
  });
});
