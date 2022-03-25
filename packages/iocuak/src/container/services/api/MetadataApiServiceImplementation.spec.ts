jest.mock('../../../binding/utils/api/convertBindingToBindingApi');
jest.mock('../../../metadata/utils/api/convertClassMetadataToClassMetadataApi');

import { BindingApi } from '../../../binding/models/api/BindingApi';
import { BindingApiType } from '../../../binding/models/api/BindingApiType';
import { Binding } from '../../../binding/models/domain/Binding';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { Newable } from '../../../common/models/domain/Newable';
import { ClassMetadataApi } from '../../../metadata/models/api/ClassMetadataApi';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { convertClassMetadataToClassMetadataApi } from '../../../metadata/utils/api/convertClassMetadataToClassMetadataApi';
import { TaskScopeApi } from '../../../task/models/api/TaskScopeApi';
import { TaskScope } from '../../../task/models/domain/TaskScope';
import { ContainerMetadataService } from '../domain/ContainerMetadataService';
import { MetadataApiServiceImplementation } from './MetadataApiServiceImplementation';

describe(MetadataApiServiceImplementation.name, () => {
  let metadataServiceMock: jest.Mocked<ContainerMetadataService>;
  let metadataApiServiceImplementation: MetadataApiServiceImplementation;

  beforeAll(() => {
    metadataServiceMock = {
      getBindingMetadata: jest.fn(),
      getClassMetadata: jest.fn(),
    };

    metadataApiServiceImplementation = new MetadataApiServiceImplementation(
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
          scope: TaskScope.singleton,
          type: class {},
        };

        bindingApiFixture = {
          bindingType: BindingApiType.type,
          id: bindingFixture.id,
          scope: TaskScopeApi.singleton,
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
          convertClassMetadataToClassMetadataApi as jest.Mock<
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
        expect(convertClassMetadataToClassMetadataApi).toHaveBeenCalledTimes(1);
        expect(convertClassMetadataToClassMetadataApi).toHaveBeenCalledWith(
          classMetadataFixture,
        );
      });

      it('should return ClassMetadataApi', () => {
        expect(result).toStrictEqual(classMetadataApiFixture);
      });
    });
  });
});
