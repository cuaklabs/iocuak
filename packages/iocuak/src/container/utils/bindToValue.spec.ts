import { ValueBindingFixtures } from '../../binding/fixtures/domain/ValueBindingFixtures';
import { ValueBinding } from '../../binding/models/domain/ValueBinding';
import { BindingService } from '../../binding/services/domain/BindingService';
import { bindToValue } from '../../container/utils/bindToValue';

describe(bindToValue.name, () => {
  describe('when called', () => {
    let valueBindingFixture: ValueBinding;
    let containerBindingServiceMock: jest.Mocked<BindingService>;

    beforeAll(() => {
      valueBindingFixture = ValueBindingFixtures.withNoTags;
      containerBindingServiceMock = {
        set: jest.fn(),
      } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;

      bindToValue(
        valueBindingFixture.id,
        valueBindingFixture.value,
        containerBindingServiceMock,
      );
    });

    it('should call containerBindingService.set()', () => {
      expect(containerBindingServiceMock.set).toHaveBeenCalledTimes(1);
      expect(containerBindingServiceMock.set).toHaveBeenCalledWith(
        valueBindingFixture,
      );
    });
  });
});
