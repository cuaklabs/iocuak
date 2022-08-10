import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('@cuaklabs/iocuak-core');

jest.mock('../../../binding/utils/api/convertBindingToBindingApi');
jest.mock('../../../classMetadata/utils/api/convertToClassMetadataApi');

import { Newable } from '@cuaklabs/iocuak-common';
import { getBindingMetadata, getClassMetadata } from '@cuaklabs/iocuak-core';
import { TypeBinding, ClassMetadata } from '@cuaklabs/iocuak-models';
import {
  BindingScopeApi,
  BindingTypeApi,
  TypeBindingApi,
  ClassMetadataApi,
} from '@cuaklabs/iocuak-models-api';

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { convertToClassMetadataApi } from '../../../classMetadata/utils/api/convertToClassMetadataApi';
import { MetadataServiceApiImplementation } from './MetadataServiceApiImplementation';

describe(MetadataServiceApiImplementation.name, () => {
  let metadataApiServiceImplementation: MetadataServiceApiImplementation;

  beforeAll(() => {
    metadataApiServiceImplementation = new MetadataServiceApiImplementation();
  });

  describe('.getBindingMetadata', () => {
    let typeFixture: Newable;

    beforeAll(() => {
      typeFixture = class {};
    });

    describe('when called, and metadataServiceMock.getBindingMetadata() returns undefined', () => {
      let result: unknown;

      beforeAll(() => {
        (
          getBindingMetadata as jestMock.Mock<typeof getBindingMetadata>
        ).mockReturnValueOnce(undefined);

        result =
          metadataApiServiceImplementation.getBindingMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call metadataApiService.getBindingMetadata()', () => {
        expect(getBindingMetadata).toHaveBeenCalledTimes(1);
        expect(getBindingMetadata).toHaveBeenCalledWith(typeFixture);
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
          tags: [...bindingFixture.tags],
          type: bindingFixture.type,
        };

        (
          getBindingMetadata as jestMock.Mock<typeof getBindingMetadata>
        ).mockReturnValueOnce(bindingFixture);

        (
          convertBindingToBindingApi as jestMock.Mock<
            typeof convertBindingToBindingApi
          >
        ).mockReturnValueOnce(bindingApiFixture);

        result =
          metadataApiServiceImplementation.getBindingMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call metadataApiService.getBindingMetadata()', () => {
        expect(getBindingMetadata).toHaveBeenCalledTimes(1);
        expect(getBindingMetadata).toHaveBeenCalledWith(typeFixture);
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

        (
          getClassMetadata as jestMock.Mock<typeof getClassMetadata>
        ).mockReturnValueOnce(classMetadataFixture);

        (
          convertToClassMetadataApi as jestMock.Mock<
            typeof convertToClassMetadataApi
          >
        ).mockReturnValueOnce(classMetadataApiFixture);

        result = metadataApiServiceImplementation.getClassMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getClassMetadata()', () => {
        expect(getClassMetadata).toHaveBeenCalledTimes(1);
        expect(getClassMetadata).toHaveBeenCalledWith(typeFixture);
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
