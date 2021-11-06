import 'reflect-metadata';

import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { ClassMetadata } from '../models/domain/ClassMetadata';
import { MetadataKey } from '../models/domain/MetadataKey';
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
      expect(reflectMetadata).toStrictEqual<ClassMetadata>({
        constructorArguments: [],
        properties: new Map([['foo', serviceIdFixture]]),
      });
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
      expect(reflectMetadata).toStrictEqual<ClassMetadata>({
        constructorArguments: [serviceIdFixture],
        properties: new Map(),
      });
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
      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining<Partial<Error>>({
          message:
            expect.stringContaining(`Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method`) as string,
        }),
      );
    });
  });
});
