import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ValueBinding } from '@cuaklabs/iocuak-models';

import { ValueBindingFixtures } from '../fixtures/ValueBindingFixtures';
import { BindingService } from '../services/BindingService';
import { bindToValue } from './bindToValue';

describe(bindToValue.name, () => {
  describe.each<[string, ValueBinding]>([
    ['value binding', ValueBindingFixtures.any],
    ['value binding with tags', ValueBindingFixtures.withTagsOne],
  ])('having a %s', (_: string, valueBindingFixture: ValueBinding) => {
    describe('when called', () => {
      let bindingServiceMock: jest.Mocked<BindingService>;

      beforeAll(() => {
        bindingServiceMock = {
          set: jest.fn(),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        bindToValue(
          valueBindingFixture.id,
          valueBindingFixture.tags,
          valueBindingFixture.value,
          bindingServiceMock,
        );
      });

      it('should call containerBindingService.set()', () => {
        expect(bindingServiceMock.set).toHaveBeenCalledTimes(1);
        expect(bindingServiceMock.set).toHaveBeenCalledWith(
          valueBindingFixture,
        );
      });
    });
  });
});
