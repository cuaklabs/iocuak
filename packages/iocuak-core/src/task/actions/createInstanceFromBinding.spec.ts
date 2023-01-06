import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./createInstanceFromTypeBinding');

import { TypeBinding, ValueBinding } from '@cuaklabs/iocuak-models';

import { TypeBindingFixtures } from '../../binding/fixtures/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../binding/fixtures/ValueBindingFixtures';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstanceFromBinding } from './createInstanceFromBinding';
import { createInstanceFromTypeBinding } from './createInstanceFromTypeBinding';

describe(createInstanceFromBinding.name, () => {
  describe('having a TypeBinding', () => {
    let typeBindingFixture: TypeBinding;

    beforeAll(() => {
      typeBindingFixture = TypeBindingFixtures.any;
    });

    describe('when called', () => {
      let taskContextFixture: CreateInstanceTaskContext;
      let instanceFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        taskContextFixture = {
          _type: Symbol(),
        } as unknown as CreateInstanceTaskContext;
        instanceFixture = Symbol();

        (
          createInstanceFromTypeBinding as jest.Mock<
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
      let taskContextFixture: CreateInstanceTaskContext;

      let result: unknown;

      beforeAll(() => {
        taskContextFixture = {
          _type: Symbol(),
        } as unknown as CreateInstanceTaskContext;

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
