jest.mock('./getBindingOrThrow');

import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { TypeBindingFixtures } from '../../fixtures/domain/TypeBindingFixtures';
import { BindingScope } from '../../models/domain/BindingScope';
import { BindingType } from '../../models/domain/BindingType';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { getBindingOrThrow } from './getBindingOrThrow';
import { lazyGetBindingOrThrow } from './lazyGetBindingOrThrow';

describe(lazyGetBindingOrThrow.name, () => {
  let metadataServiceFixture: MetadataService;

  beforeAll(() => {
    metadataServiceFixture = {
      _tag: Symbol('MetadataService'),
    } as Partial<MetadataService> as MetadataService;
  });

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

        (getBindingOrThrow as jest.Mock<TypeBinding>).mockReturnValueOnce(
          bindingFixture,
        );

        result = lazyGetBindingOrThrow(
          serviceIdFixture,
          metadataServiceFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getBindingOrThrow()', () => {
        expect(getBindingOrThrow).toHaveBeenCalledTimes(1);
        expect(getBindingOrThrow).toHaveBeenCalledWith(
          serviceIdFixture,
          metadataServiceFixture,
        );
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
          lazyGetBindingOrThrow(serviceIdFixture, metadataServiceFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: expect.stringContaining(
              'No registered bindings found for type',
            ) as string,
          }),
        );
      });
    });
  });
});
