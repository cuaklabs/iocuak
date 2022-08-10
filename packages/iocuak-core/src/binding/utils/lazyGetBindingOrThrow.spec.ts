import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./getBindingOrThrow');

import { Newable, ServiceId } from '@cuaklabs/iocuak-common';
import { TypeBinding } from '@cuaklabs/iocuak-models';

import { TypeBindingFixtures } from '../fixtures/TypeBindingFixtures';
import { getBindingOrThrow } from './getBindingOrThrow';
import { lazyGetBindingOrThrow } from './lazyGetBindingOrThrow';

describe(lazyGetBindingOrThrow.name, () => {
  describe('having a newable serviceId', () => {
    let serviceIdFixture: Newable;

    beforeAll(() => {
      serviceIdFixture = class {};
    });

    describe('when called', () => {
      let bindingFixture: TypeBinding;

      let result: unknown;

      beforeAll(() => {
        bindingFixture = {
          ...TypeBindingFixtures.any,
          id: serviceIdFixture,
          type: serviceIdFixture,
        };

        (
          getBindingOrThrow as jestMock.Mock<typeof getBindingOrThrow>
        ).mockReturnValueOnce(bindingFixture);

        result = lazyGetBindingOrThrow(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getBindingOrThrow()', () => {
        expect(getBindingOrThrow).toHaveBeenCalledTimes(1);
        expect(getBindingOrThrow).toHaveBeenCalledWith(serviceIdFixture);
      });

      it('should return a type binding', () => {
        expect(result).toBe(bindingFixture);
      });
    });
  });

  describe('having a non newable serviceId', () => {
    let serviceIdFixture: ServiceId;

    beforeAll(() => {
      serviceIdFixture = 'service-id';
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        try {
          lazyGetBindingOrThrow(serviceIdFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        const expectedError: Partial<Error> = {
          message: expect.stringContaining(
            'No registered bindings found for type',
          ) as unknown as string,
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(expect.objectContaining(expectedError));
      });
    });
  });
});
