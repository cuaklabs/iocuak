jest.mock('../../../binding/utils/api/convertBindingToBindingApi');
jest.mock('../../../classMetadata/utils/api/convertToClassMetadataApi');

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { BindingApi } from '../../../binding/models/api/BindingApi';
import { BindingScopeApi } from '../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../binding/models/api/TypeBindingApi';
import { Binding } from '../../../binding/models/domain/Binding';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { ClassMetadataApi } from '../../../classMetadata/models/api/ClassMetadataApi';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { convertToClassMetadataApi } from '../../../classMetadata/utils/api/convertToClassMetadataApi';
import { Newable } from '../../../common/models/domain/Newable';
import { MetadataService } from '../domain/MetadataService';
import { MetadataServiceApiImplementation } from './MetadataServiceApiImplementation';

describe(MetadataServiceApiImplementation.name, () => {
  let metadataServiceMock: jest.Mocked<MetadataService>;
  let metadataApiServiceImplementation: MetadataServiceApiImplementation;

  beforeAll(() => {
    metadataServiceMock = {
      getBindingMetadata: jest.fn(),
      getClassMetadata: jest.fn(),
    };

    metadataApiServiceImplementation = new MetadataServiceApiImplementation(
      metadataServiceMock,
    );
  });

  describe('.getBindingMetadata', () => {
    let typeFixture: Newable;

    beforeAll(() => {
      typeFixture = class {};
    });

    describe('when called, and metadataServiceMock.getBindingMetadata() returns undefined', () => {
      let result: unknown;

      beforeAll(() => {
        metadataServiceMock.getBindingMetadata.mockReturnValueOnce(undefined);

        result =
          metadataApiServiceImplementation.getBindingMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call metadataApiService.getBindingMetadata()', () => {
        expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledTimes(1);
        expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledWith(
          typeFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and metadataService.getBindingMetadata() returns TypeBinding', () => {
      let bindingFixture: TypeBinding;
      let bindingApiFixture: TypeBindingApi;
      let result: unknown;

      beforeAll(() => {
        bindingFixture = TypeBindingFixtures.any;

        bindingApiFixture = {
          bindingType: BindingTypeApi.type,
          id: bindingFixture.id,
          scope: BindingScopeApi.singleton,
          type: bindingFixture.type,
        };

        metadataServiceMock.getBindingMetadata.mockReturnValueOnce(
          bindingFixture,
        );

        (
          convertBindingToBindingApi as jest.Mock<BindingApi, [Binding]>
        ).mockReturnValueOnce(bindingApiFixture);

        result =
          metadataApiServiceImplementation.getBindingMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call metadataApiService.getBindingMetadata()', () => {
        expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledTimes(1);
        expect(metadataServiceMock.getBindingMetadata).toHaveBeenCalledWith(
          typeFixture,
        );
      });

      it('should call convertBindingToBindingApi()', () => {
        expect(convertBindingToBindingApi).toHaveBeenCalledTimes(1);
        expect(convertBindingToBindingApi).toHaveBeenCalledWith(bindingFixture);
      });

      it('should return a bindingApi', () => {
        expect(result).toStrictEqual(bindingApiFixture);
      });
    });
  });

  describe('.getClassMetadata', () => {
    let typeFixture: Newable;

    beforeAll(() => {
      typeFixture = class {};
    });

    describe('when called', () => {
      let classMetadataFixture: ClassMetadata;
      let classMetadataApiFixture: ClassMetadataApi;
      let result: unknown;

      beforeAll(() => {
        classMetadataFixture = {
          constructorArguments: [],
          properties: new Map(),
        };

        classMetadataApiFixture = {
          constructorArguments: [],
          properties: new Map(),
        };

        metadataServiceMock.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture,
        );

        (
          convertToClassMetadataApi as jest.Mock<
            ClassMetadataApi,
            [ClassMetadata]
          >
        ).mockReturnValueOnce(classMetadataApiFixture);

        result = metadataApiServiceImplementation.getClassMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call metadataService.getClassMetadata()', () => {
        expect(metadataServiceMock.getClassMetadata).toHaveBeenCalledTimes(1);
        expect(metadataServiceMock.getClassMetadata).toHaveBeenCalledWith(
          typeFixture,
        );
      });

      it('should call convertClassMetadataToClassMetadataApi()', () => {
        expect(convertToClassMetadataApi).toHaveBeenCalledTimes(1);
        expect(convertToClassMetadataApi).toHaveBeenCalledWith(
          classMetadataFixture,
        );
      });

      it('should return ClassMetadataApi', () => {
        expect(result).toStrictEqual(classMetadataApiFixture);
      });
    });
  });
});
