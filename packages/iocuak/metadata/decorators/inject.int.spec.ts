import 'reflect-metadata';

import { Newable } from '../../task/models/domain/Newable';
import { ServiceId } from '../../task/models/domain/ServiceId';
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

  describe('when called, as parameter decorator', () => {
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
});
