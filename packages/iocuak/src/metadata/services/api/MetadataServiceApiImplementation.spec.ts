jest.mock('../../../classMetadata/utils/api/convertToClassMetadataApi');
jest.mock('../../utils/api/convertBindingToBindingApi');

import { ClassMetadataApi } from '../../../classMetadata/models/api/ClassMetadataApi';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { convertToClassMetadataApi } from '../../../classMetadata/utils/api/convertToClassMetadataApi';
import { Newable } from '../../../common/models/domain/Newable';
import { BindingApi } from '../../models/api/BindingApi';
import { BindingScopeApi } from '../../models/api/BindingScopeApi';
import { BindingTypeApi } from '../../models/api/BindingTypeApi';
import { Binding } from '../../models/domain/Binding';
import { BindingScope } from '../../models/domain/BindingScope';
import { BindingType } from '../../models/domain/BindingType';
import { convertBindingToBindingApi } from '../../utils/api/convertBindingToBindingApi';
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

    describe('when called, and metadataService.getBindingMetadata() returns Binding', () => {
      let bindingFixture: Binding;
      let bindingApiFixture: BindingApi;
      let result: unknown;

      beforeAll(() => {
        bindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: BindingScope.singleton,
          type: class {},
        };

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
