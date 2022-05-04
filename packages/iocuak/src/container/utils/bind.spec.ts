jest.mock('../../binding/utils/domain/getBindingOrThrow');

import { TypeBindingFixtures } from '../../binding/fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { BindingService } from '../../binding/services/domain/BindingService';
import { getBindingOrThrow } from '../../binding/utils/domain/getBindingOrThrow';
import { Newable } from '../../common/models/domain/Newable';
import { bind } from '../../container/utils/bind';
import { MetadataService } from '../../metadata/services/domain/MetadataService';

describe(bind.name, () => {
  let typeFixture: Newable;
  let containerBindingServiceMock: jest.Mocked<BindingService>;
  let metadataServiceMock: jest.Mocked<MetadataService>;

  beforeAll(() => {
    typeFixture = class {};

    containerBindingServiceMock = {
      set: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;

    metadataServiceMock = {
      getBindingMetadata: jest.fn(),
    } as Partial<jest.Mocked<MetadataService>> as jest.Mocked<MetadataService>;
  });

  describe('when called', () => {
    let bindingFixture: TypeBinding;

    beforeAll(() => {
      bindingFixture = TypeBindingFixtures.any;

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
