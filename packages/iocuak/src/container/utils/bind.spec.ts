import { Newable } from '../../common/models/domain/Newable';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { bind } from '../../container/utils/bind';
import { BindingScope } from '../../metadata/models/domain/BindingScope';
import { BindingType } from '../../metadata/models/domain/BindingType';
import { TypeBinding } from '../../metadata/models/domain/TypeBinding';
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

  describe('when called, and metadataService.getBindingMetadata returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      metadataServiceMock.getBindingMetadata.mockReturnValueOnce(undefined);

      try {
        bind(typeFixture, containerBindingServiceMock, metadataServiceMock);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataServiceMock.getBindingMetadata()', () => {
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledTimes(1);
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledWith(
        typeFixture,
      );
    });

    it('should throw an error', () => {
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

  describe('when called, and metadataService.getBindingMetadata returns a type binding', () => {
    let bindingFixture: TypeBinding;

    beforeAll(() => {
      bindingFixture = {
        bindingType: BindingType.type,
        id: 'sample-service-id',
        scope: BindingScope.transient,
        type: typeFixture,
      };

      metadataServiceMock.getBindingMetadata.mockReturnValueOnce(
        bindingFixture,
      );

      bind(typeFixture, containerBindingServiceMock, metadataServiceMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataServiceMock.getBindingMetadata()', () => {
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledTimes(1);
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledWith(
        typeFixture,
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
