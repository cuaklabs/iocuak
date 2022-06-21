import 'reflect-metadata';

import { beforeAll, describe, expect, it } from '@jest/globals';

import { ClassMetadata } from '../../classMetadata/models/domain/ClassMetadata';
import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { MetadataKey } from '../../reflectMetadata/models/domain/MetadataKey';
import { ClassElementMetadataType } from '../models/domain/ClassElementMetadataType';
import { inject } from './inject';

describe(inject.name, () => {
  describe('when called, as property decorator', () => {
    let serviceIdFixture: ServiceId;
    let targetFixture: Newable;

    let reflectMetadata: unknown;

    beforeAll(() => {
      serviceIdFixture = 'service-id';

      class TargetFixture {
        @inject(serviceIdFixture)
        public foo: string | undefined;
      }

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        MetadataKey.inject,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      const expectedClassMetadata: ClassMetadata = {
        constructorArguments: [],
        properties: new Map([
          [
            'foo',
            {
              type: ClassElementMetadataType.serviceId,
              value: serviceIdFixture,
            },
          ],
        ]),
      };

      expect(reflectMetadata).toStrictEqual(expectedClassMetadata);
    });
  });

  describe('when called, as a constructor parameter decorator', () => {
    let serviceIdFixture: ServiceId;
    let targetFixture: Newable;

    let reflectMetadata: unknown;

    beforeAll(() => {
      serviceIdFixture = 'service-id';

      class TargetFixture {
        constructor(@inject(serviceIdFixture) public foo: string | undefined) {}
      }

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        MetadataKey.inject,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      const expectedClassMetadata: ClassMetadata = {
        constructorArguments: [
          {
            type: ClassElementMetadataType.serviceId,
            value: serviceIdFixture,
          },
        ],
        properties: new Map(),
      };

      expect(reflectMetadata).toStrictEqual(expectedClassMetadata);
    });
  });

  describe('when called, as a method parameter decorator', () => {
    let result: unknown;

    beforeAll(() => {
      const serviceIdFixture: ServiceId = 'service-id';

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TypeFixture {
          constructor(public foo: string | undefined) {}

          public someMethod(@inject(serviceIdFixture) foo: unknown): unknown {
            return foo;
          }
        }
      } catch (error: unknown) {
        result = error;
      }
    });

    it('should throw an error', () => {
      const expectedErrorPartial: Partial<Error> = {
        message:
          expect.stringContaining(`Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method`) as unknown as string,
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedErrorPartial),
      );
    });
  });
});
