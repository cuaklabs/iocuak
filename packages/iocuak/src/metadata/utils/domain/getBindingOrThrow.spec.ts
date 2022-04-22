import { Newable } from '../../../common/models/domain/Newable';
import { BindingScope } from '../../models/domain/BindingScope';
import { BindingType } from '../../models/domain/BindingType';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { MetadataService } from '../../services/domain/MetadataService';
import { getBindingOrThrow } from './getBindingOrThrow';

describe(getBindingOrThrow.name, () => {
  let typeFixture: Newable;
  let metadataServiceMock: jest.Mocked<MetadataService>;

  beforeAll(() => {
    typeFixture = class {};

    metadataServiceMock = {
      getBindingMetadata: jest.fn(),
    } as Partial<jest.Mocked<MetadataService>> as jest.Mocked<MetadataService>;
  });

  describe('when called, and metadataService.getBindingMetadata() returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      metadataServiceMock.getBindingMetadata.mockReturnValueOnce(undefined);

      try {
        getBindingOrThrow(typeFixture, metadataServiceMock);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataSErvice.getBindingMetadata()', () => {
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledTimes(1);
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledWith(
        typeFixture,
      );
    });

    it('should throw an Error', () => {
      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining<Partial<Error>>({
          message: expect.stringContaining(
            'An @injectable() decorator may be missing',
          ) as string,
        }),
      );
    });
  });

  describe('when called, and metadataService.getBindingMetadata() returns a binding', () => {
    let bindingFixture: TypeBinding;

    let result: unknown;

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

      result = getBindingOrThrow(typeFixture, metadataServiceMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataSErvice.getBindingMetadata()', () => {
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledTimes(1);
      expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledWith(
        typeFixture,
      );
    });

    it('should return a TypeBinding', () => {
      expect(result).toBe(bindingFixture);
    });
  });
});
