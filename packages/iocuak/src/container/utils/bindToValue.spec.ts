import { BindingType } from '../../binding/models/domain/BindingType';
import { ValueBinding } from '../../binding/models/domain/ValueBinding';
import { BindingService } from '../../binding/services/domain/BindingService';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { bindToValue } from '../../container/utils/bindToValue';

describe(bindToValue.name, () => {
  describe('when called', () => {
    let serviceIdFixture: ServiceId;
    let valueFixture: unknown;
    let containerBindingServiceMock: jest.Mocked<BindingService>;

    beforeAll(() => {
      serviceIdFixture = 'service-id';
      valueFixture = {};
      containerBindingServiceMock = {
        set: jest.fn(),
      } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;

      bindToValue(serviceIdFixture, valueFixture, containerBindingServiceMock);
    });

    it('should call containerBindingService.set()', () => {
      const expectedValueBinding: ValueBinding = {
        bindingType: BindingType.value,
        id: serviceIdFixture,
        value: valueFixture,
      };

      expect(containerBindingServiceMock.set).toHaveBeenCalledTimes(1);
      expect(containerBindingServiceMock.set).toHaveBeenCalledWith(
        expectedValueBinding,
      );
    });
  });
});
