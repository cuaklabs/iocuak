import 'reflect-metadata';

jest.mock('../../reflectMetadata/utils/domain/updateReflectMetadata');

import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { MetadataKey } from '../../reflectMetadata/models/domain/MetadataKey';
import { updateReflectMetadata } from '../../reflectMetadata/utils/domain/updateReflectMetadata';
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

  describe('when called, as constructor parameter decorator', () => {
    let serviceIdFixture: ServiceId;
    let targetFixture: Newable;

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

  describe('when called, as non constructor parameter decorator', () => {
    let serviceIdFixture: ServiceId;

    let result: unknown;

    beforeAll(() => {
      try {
        serviceIdFixture = 'service-id';

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TargetFixture {
          public doSomethingWithFoo(
            @inject(serviceIdFixture) foo: string | undefined,
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
      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining<Partial<Error>>({
          message: `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "doSomethingWithFoo" at class "TargetFixture"`,
        }),
      );
    });
  });
});
