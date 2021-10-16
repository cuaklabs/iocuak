import 'reflect-metadata';

jest.mock('../utils/updateReflectMetadata');

import { Newable } from '../../task/models/domain/Newable';
import { ServiceId } from '../../task/models/domain/ServiceId';
import { MetadataKey } from '../models/domain/MetadataKey';
import { updateReflectMetadata } from '../utils/updateReflectMetadata';
import { inject } from './inject';

describe(inject.name, () => {
  describe('when called, as property decorator', () => {
    let serviceIdFixture: ServiceId;
    let targetFixture: Newable;

    beforeAll(() => {
      serviceIdFixture = 'service-id';

      class TargetFixture {
        @inject(serviceIdFixture)
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

  describe('when called, as parameter decorator', () => {
    let serviceIdFixture: ServiceId;
    let targetFixture: Newable<unknown, [string | undefined]>;

    beforeAll(() => {
      serviceIdFixture = 'service-id';

      class TargetFixture {
        constructor(@inject(serviceIdFixture) public foo: string | undefined) {}
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
});
