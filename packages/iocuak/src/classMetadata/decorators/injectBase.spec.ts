import 'reflect-metadata';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('../../reflectMetadata/utils/domain/updateReflectMetadata');

import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { MetadataKey } from '../../reflectMetadata/models/domain/MetadataKey';
import { updateReflectMetadata } from '../../reflectMetadata/utils/domain/updateReflectMetadata';
import { ClassElementMetadata } from '../models/domain/ClassElementMetadata';
import { injectBase } from './injectBase';

describe(injectBase.name, () => {
  let inputToClassElementMetadataMock: jestMock.Mock<
    (input: ServiceId) => ClassElementMetadata
  >;

  beforeAll(() => {
    inputToClassElementMetadataMock =
      jest.fn<(input: ServiceId) => ClassElementMetadata>();
  });

  describe('when called, as property decorator', () => {
    let serviceIdFixture: ServiceId;
    let targetFixture: Newable;

    beforeAll(() => {
      serviceIdFixture = 'service-id';

      class TargetFixture {
        @injectBase(serviceIdFixture, inputToClassElementMetadataMock)
        public foo: string | undefined;
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        MetadataKey.inject,
        expect.anything(),
        expect.any(Function),
      );
    });
  });

  describe('when called, as constructor parameter decorator', () => {
    let serviceIdFixture: ServiceId;
    let targetFixture: Newable;

    beforeAll(() => {
      serviceIdFixture = 'service-id';

      class TargetFixture {
        constructor(
          @injectBase(serviceIdFixture, inputToClassElementMetadataMock)
          public foo: string | undefined,
        ) {}
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        MetadataKey.inject,
        expect.anything(),
        expect.any(Function),
      );
    });
  });

  describe('when called, as non constructor parameter decorator', () => {
    let serviceIdFixture: ServiceId;

    let result: unknown;

    beforeAll(() => {
      try {
        serviceIdFixture = 'service-id';

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TargetFixture {
          public doSomethingWithFoo(
            @injectBase(serviceIdFixture, inputToClassElementMetadataMock)
            foo: string | undefined,
          ) {
            console.log(foo ?? '?');
          }
        }
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should throw an error', () => {
      const expectedPartialError: Partial<Error> = {
        message: `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "doSomethingWithFoo" at class "TargetFixture"`,
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedPartialError),
      );
    });
  });
});
