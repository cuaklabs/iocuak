jest.mock('../../binding/utils/domain/getBindingOrThrow');

import { BindingScope } from '../../binding/models/domain/BindingScope';
import { BindingType } from '../../binding/models/domain/BindingType';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { getBindingOrThrow } from '../../binding/utils/domain/getBindingOrThrow';
import { Newable } from '../../common/models/domain/Newable';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { bind } from '../../container/utils/bind';
import { MetadataService } from '../../metadata/services/domain/MetadataService';

describe(bind.name, () => {
  let typeFixture: Newable;
  let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
  let metadataServiceMock: jest.Mocked<MetadataService>;

  beforeAll(() => {
    typeFixture = class {};

    containerBindingServiceMock = {
      set: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerBindingService>
    > as jest.Mocked<ContainerBindingService>;

    metadataServiceMock = {
      getBindingMetadata: jest.fn(),
    } as Partial<jest.Mocked<MetadataService>> as jest.Mocked<MetadataService>;
  });

  describe('when called', () => {
    let bindingFixture: TypeBinding;

    beforeAll(() => {
      bindingFixture = {
        bindingType: BindingType.type,
        id: 'sample-service-id',
        scope: BindingScope.transient,
        type: typeFixture,
      };

      (getBindingOrThrow as jest.Mock<TypeBinding>).mockReturnValueOnce(
        bindingFixture,
      );

      bind(typeFixture, containerBindingServiceMock, metadataServiceMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBindingOrThrow()', () => {
      expect(getBindingOrThrow).toHaveBeenCalledTimes(1);
      expect(getBindingOrThrow).toHaveBeenCalledWith(
        typeFixture,
        metadataServiceMock,
      );
    });

    it('should call containerService.binding.set()', () => {
      expect(containerBindingServiceMock.set).toHaveBeenCalledTimes(1);
      expect(containerBindingServiceMock.set).toHaveBeenCalledWith(
        bindingFixture,
      );
    });
  });
});
