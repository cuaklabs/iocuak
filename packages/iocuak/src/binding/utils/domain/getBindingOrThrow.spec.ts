import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('@cuaklabs/iocuak-binding');

import { getBindingMetadata } from '@cuaklabs/iocuak-binding';
import { Newable } from '@cuaklabs/iocuak-common';

import { TypeBindingFixtures } from '../../fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { getBindingOrThrow } from './getBindingOrThrow';

describe(getBindingOrThrow.name, () => {
  let typeFixture: Newable;

  beforeAll(() => {
    typeFixture = class {};
  });

  describe('when called, and metadataService.getBindingMetadata() returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      (
        getBindingMetadata as jestMock.Mock<typeof getBindingMetadata>
      ).mockReturnValueOnce(undefined);

      try {
        getBindingOrThrow(typeFixture);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataService.getBindingMetadata()', () => {
      expect(getBindingMetadata).toHaveBeenCalledTimes(1);
      expect(getBindingMetadata).toHaveBeenCalledWith(typeFixture);
    });

    it('should throw an Error', () => {
      const expectedError: Partial<Error> = {
        message: expect.stringContaining(
          'An @injectable() decorator may be missing',
        ) as unknown as string,
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(expect.objectContaining(expectedError));
    });
  });

  describe('when called, and metadataService.getBindingMetadata() returns a binding', () => {
    let bindingFixture: TypeBinding;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = TypeBindingFixtures.any;

      (
        getBindingMetadata as jestMock.Mock<typeof getBindingMetadata>
      ).mockReturnValueOnce(bindingFixture);

      result = getBindingOrThrow(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBindingMetadata()', () => {
      expect(getBindingMetadata).toHaveBeenCalledTimes(1);
      expect(getBindingMetadata).toHaveBeenCalledWith(typeFixture);
    });

    it('should return a TypeBinding', () => {
      expect(result).toBe(bindingFixture);
    });
  });
});
