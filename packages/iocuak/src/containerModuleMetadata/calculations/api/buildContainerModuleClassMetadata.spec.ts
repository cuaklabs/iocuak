import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../containerModule/utils/api/convertToContainerModule');
jest.mock('./buildContainerModuleClassMetadataId');

import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';
import {
  BindingService,
  ContainerModule,
  ContainerModuleClassMetadata,
  ContainerModuleMetadataType,
} from '@cuaklabs/iocuak-core';

import { convertToContainerModule } from '../../../containerModule/utils/api/convertToContainerModule';
import { ContainerModuleMetadataApiMocks } from '../../mocks/models/api/ContainerModuleMetadataApiMocks';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { buildContainerModuleClassMetadata } from './buildContainerModuleClassMetadata';
import { buildContainerModuleClassMetadataId } from './buildContainerModuleClassMetadataId';

describe(buildContainerModuleClassMetadata.name, () => {
  let containerModuleClassMetadataApiFixture: ContainerModuleClassMetadataApi;
  let requiredMetadataIdFixture: ContainerModuleMetadataId[];

  beforeAll(() => {
    containerModuleClassMetadataApiFixture =
      ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi;

    requiredMetadataIdFixture = [Symbol()];
  });

  describe('when called', () => {
    let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
    let result: unknown;

    let containerModuleClassMetadata: ContainerModuleClassMetadata;

    beforeAll(() => {
      containerModuleMetadataIdFixture = Symbol();

      (
        buildContainerModuleClassMetadataId as jest.Mock<
          typeof buildContainerModuleClassMetadataId
        >
      ).mockReturnValueOnce(containerModuleMetadataIdFixture);

      containerModuleClassMetadata = buildContainerModuleClassMetadata(
        containerModuleClassMetadataApiFixture,
        requiredMetadataIdFixture,
      );

      result = containerModuleClassMetadata;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call buildContainerModuleClassMetadataId()', () => {
      expect(buildContainerModuleClassMetadataId).toHaveBeenCalledTimes(1);
      expect(buildContainerModuleClassMetadataId).toHaveBeenCalledWith(
        containerModuleClassMetadataApiFixture,
      );
    });

    it('should return a ContainerModuleClassMetadata', () => {
      const expected: ContainerModuleClassMetadata = {
        id: containerModuleMetadataIdFixture,
        imports: [],
        loader: expect.any(Function) as unknown as (
          module: unknown,
          containerBindingService: BindingService,
        ) => void,
        moduleType: containerModuleClassMetadataApiFixture.module,
        requires: requiredMetadataIdFixture,
        type: ContainerModuleMetadataType.clazz,
      };

      expect(result).toStrictEqual(expected);
    });

    describe('when containerModuleClassMetadata.loader() is called', () => {
      let moduleFixture: unknown;
      let bindingServiceFixture: BindingService;
      let containerModuleMock: jest.Mocked<ContainerModule>;

      beforeAll(() => {
        moduleFixture = Symbol();
        bindingServiceFixture = Symbol() as unknown as BindingService;
        containerModuleMock = {
          load: jest.fn(),
        };

        (
          convertToContainerModule as jest.Mock<typeof convertToContainerModule>
        ).mockReturnValueOnce(containerModuleMock);

        containerModuleClassMetadata.loader(
          moduleFixture,
          bindingServiceFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call convertToContainerModule()', () => {
        expect(convertToContainerModule).toHaveBeenCalledTimes(1);
        expect(convertToContainerModule).toHaveBeenCalledWith(moduleFixture);
      });

      it('should call containerModule.load()', () => {
        expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleMock.load).toHaveBeenCalledWith(
          bindingServiceFixture,
        );
      });
    });
  });
});
