import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Binding } from '../../models/domain/Binding';
import { BindingScope } from '../../models/domain/BindingScope';
import { BindingType } from '../../models/domain/BindingType';
import { lazyGetBindingOrThrow } from './lazyGetBindingOrThrow';

describe(lazyGetBindingOrThrow.name, () => {
  describe('having a newable serviceId', () => {
    let serviceIdFixture: ServiceId;

    beforeAll(() => {
      serviceIdFixture = class {};
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = lazyGetBindingOrThrow(serviceIdFixture);
      });

      it('should return a binding', () => {
        const expected: Binding = {
          bindingType: BindingType.type,
          id: serviceIdFixture,
          scope: BindingScope.transient,
          type: serviceIdFixture as Newable,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a non newable serviceId', () => {
    let serviceIdFixture: ServiceId;

    beforeAll(() => {
      serviceIdFixture = 'service-id';
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
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: expect.stringContaining(
              'No bindings found for type',
            ) as string,
          }),
        );
      });
    });
  });
});
