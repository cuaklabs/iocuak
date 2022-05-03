import { BindingType } from '../../binding/models/domain/BindingType';
import { ValueBinding } from '../../binding/models/domain/ValueBinding';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { bindToValue } from '../../container/utils/bindToValue';

describe(bindToValue.name, () => {
  describe('when called', () => {
    let serviceIdFixture: ServiceId;
    let valueFixture: unknown;
    let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;

    beforeAll(() => {
      serviceIdFixture = 'service-id';
      valueFixture = {};
      containerBindingServiceMock = {
        set: jest.fn(),
      } as Partial<
        jest.Mocked<ContainerBindingService>
      > as jest.Mocked<ContainerBindingService>;

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
