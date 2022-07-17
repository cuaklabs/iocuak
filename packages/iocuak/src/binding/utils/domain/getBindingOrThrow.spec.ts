import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { Newable } from '@cuaklabs/iocuak-common';

import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { TypeBindingFixtures } from '../../fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { getBindingOrThrow } from './getBindingOrThrow';

describe(getBindingOrThrow.name, () => {
  let typeFixture: Newable;
  let metadataServiceMock: jestMock.Mocked<MetadataService>;

  beforeAll(() => {
    typeFixture = class {};

    metadataServiceMock = {
      getBindingMetadata: jest.fn(),
    } as Partial<
      jestMock.Mocked<MetadataService>
    > as jestMock.Mocked<MetadataService>;
  });

  describe('when called, and metadataService.getBindingMetadata() returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      metadataServiceMock.getBindingMetadata.mockReturnValueOnce(undefined);

      try {
        getBindingOrThrow(typeFixture, metadataServiceMock);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataSErvice.getBindingMetadata()', () => {
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledTimes(1);
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledWith(
        typeFixture,
      );
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

      metadataServiceMock.getBindingMetadata.mockReturnValueOnce(
        bindingFixture,
      );

      result = getBindingOrThrow(typeFixture, metadataServiceMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataSErvice.getBindingMetadata()', () => {
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledTimes(1);
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledWith(
        typeFixture,
      );
    });

    it('should return a TypeBinding', () => {
      expect(result).toBe(bindingFixture);
    });
  });
});
