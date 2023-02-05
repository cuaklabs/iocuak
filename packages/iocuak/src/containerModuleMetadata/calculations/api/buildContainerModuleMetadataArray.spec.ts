import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./buildContainerModuleClassMetadata');
jest.mock('./buildContainerModuleContainerModuleMetadataId');
jest.mock('./buildContainerModuleFactoryMetadata');

import { ContainerModuleMetadataId, Newable } from '@cuaklabs/iocuak-common';
import {
  ContainerModuleClassMetadata,
  ContainerModuleFactoryMetadata,
  ContainerModuleMetadata,
} from '@cuaklabs/iocuak-core';

import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleMetadataApiMocks } from '../../mocks/models/api/ContainerModuleMetadataApiMocks';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { buildContainerModuleClassMetadata } from './buildContainerModuleClassMetadata';
import { buildContainerModuleContainerModuleMetadataId } from './buildContainerModuleContainerModuleMetadataId';
import { buildContainerModuleFactoryMetadata } from './buildContainerModuleFactoryMetadata';
import { buildContainerModuleMetadataArray } from './buildContainerModuleMetadataArray';

describe(buildContainerModuleMetadataArray.name, () => {
  describe('having a Newable<ContainerModuleApi>', () => {
    let containerModuleMetadataApiFixture: Newable<ContainerModuleApi>;

    beforeAll(() => {
      containerModuleMetadataApiFixture =
        ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi
          .module;
    });

    describe('when called', () => {
      let containerModuleMetadataFixture: ContainerModuleClassMetadata;

      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataFixture = {
          [Symbol()]: Symbol(),
        } as unknown as ContainerModuleClassMetadata;

        (
          buildContainerModuleClassMetadata as jest.Mock<
            typeof buildContainerModuleClassMetadata
          >
        ).mockReturnValueOnce(containerModuleMetadataFixture);

        result = buildContainerModuleMetadataArray(
          containerModuleMetadataApiFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleClassMetadata()', () => {
        const expected: ContainerModuleClassMetadataApi = {
          module: containerModuleMetadataApiFixture,
        };

        expect(buildContainerModuleClassMetadata).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleClassMetadata).toHaveBeenCalledWith(
          expected,
          [],
        );
      });

      it('should return a ContainerModuleMetadata[]', () => {
        expect(result).toStrictEqual([containerModuleMetadataFixture]);
      });
    });
  });

  describe('having a ContainerModuleApi', () => {
    let containerModuleMetadataApiFixture: jest.Mocked<ContainerModuleApi>;

    beforeAll(() => {
      containerModuleMetadataApiFixture = {
        load: jest.fn(),
      };
    });

    describe('when called', () => {
      let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
      let containerModuleMetadataFixture: ContainerModuleFactoryMetadata;

      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataIdFixture = Symbol();

        containerModuleMetadataFixture = {
          [Symbol()]: Symbol(),
        } as unknown as ContainerModuleFactoryMetadata;

        (
          buildContainerModuleContainerModuleMetadataId as jest.Mock<
            typeof buildContainerModuleContainerModuleMetadataId
          >
        ).mockReturnValueOnce(containerModuleMetadataIdFixture);

        (
          buildContainerModuleFactoryMetadata as jest.Mock<
            typeof buildContainerModuleFactoryMetadata
          >
        ).mockReturnValueOnce(containerModuleMetadataFixture);

        result = buildContainerModuleMetadataArray(
          containerModuleMetadataApiFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleContainerModuleMetadataId()', () => {
        expect(
          buildContainerModuleContainerModuleMetadataId,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildContainerModuleContainerModuleMetadataId,
        ).toHaveBeenCalledWith(containerModuleMetadataApiFixture);
      });

      it('should call buildContainerModuleFactoryMetadata()', () => {
        const expected: ContainerModuleFactoryMetadataApi = {
          factory: expect.any(Function) as unknown as (
            ...args: unknown[]
          ) => ContainerModuleApi | Promise<ContainerModuleApi>,
          id: containerModuleMetadataIdFixture,
        };

        expect(buildContainerModuleFactoryMetadata).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleFactoryMetadata).toHaveBeenCalledWith(
          expected,
          [],
        );
      });

      it('should return a ContainerModuleMetadata[]', () => {
        expect(result).toStrictEqual([containerModuleMetadataFixture]);
      });
    });
  });

  describe('having a ContainerModuleClassMetadataApi', () => {
    let containerModuleMetadataApiFixture: ContainerModuleClassMetadataApi;

    beforeAll(() => {
      containerModuleMetadataApiFixture =
        ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi;
    });

    describe('when called', () => {
      let containerModuleMetadataFixture: ContainerModuleClassMetadata;

      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataFixture = {
          [Symbol()]: Symbol(),
        } as unknown as ContainerModuleClassMetadata;

        (
          buildContainerModuleClassMetadata as jest.Mock<
            typeof buildContainerModuleClassMetadata
          >
        ).mockReturnValueOnce(containerModuleMetadataFixture);

        result = buildContainerModuleMetadataArray(
          containerModuleMetadataApiFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleClassMetadata()', () => {
        expect(buildContainerModuleClassMetadata).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleClassMetadata).toHaveBeenCalledWith(
          containerModuleMetadataApiFixture,
          [],
        );
      });

      it('should return a ContainerModuleMetadata[]', () => {
        expect(result).toStrictEqual([containerModuleMetadataFixture]);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi', () => {
    let containerModuleMetadataApiFixture: ContainerModuleFactoryMetadataApi;

    beforeAll(() => {
      containerModuleMetadataApiFixture =
        ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi;
    });

    describe('when called', () => {
      let containerModuleMetadataFixture: ContainerModuleFactoryMetadata;

      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataFixture = {
          [Symbol()]: Symbol(),
        } as unknown as ContainerModuleFactoryMetadata;

        (
          buildContainerModuleFactoryMetadata as jest.Mock<
            typeof buildContainerModuleFactoryMetadata
          >
        ).mockReturnValueOnce(containerModuleMetadataFixture);

        result = buildContainerModuleMetadataArray(
          containerModuleMetadataApiFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleFactoryMetadata()', () => {
        expect(buildContainerModuleFactoryMetadata).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleFactoryMetadata).toHaveBeenCalledWith(
          containerModuleMetadataApiFixture,
          [],
        );
      });

      it('should return a ContainerModuleMetadata[]', () => {
        expect(result).toStrictEqual([containerModuleMetadataFixture]);
      });
    });
  });

  describe('having ContainerModuleMetadataApi with imports', () => {
    let nestedContainerModuleMetadataApiFixture: ContainerModuleFactoryMetadataApi;
    let containerModuleMetadataApiFixture: ContainerModuleClassMetadataApi;

    beforeAll(() => {
      nestedContainerModuleMetadataApiFixture =
        ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi;

      containerModuleMetadataApiFixture = {
        ...ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi,
        imports: [nestedContainerModuleMetadataApiFixture],
      };
    });

    describe('when called', () => {
      let nestedContainerModuleMetadataFixture: ContainerModuleFactoryMetadata;
      let containerModuleMetadataFixture: ContainerModuleClassMetadata;

      let result: unknown;

      beforeAll(() => {
        nestedContainerModuleMetadataFixture = {
          id: Symbol(),
        } as unknown as ContainerModuleFactoryMetadata;

        containerModuleMetadataFixture = {
          [Symbol()]: Symbol(),
        } as unknown as ContainerModuleClassMetadata;

        (
          buildContainerModuleFactoryMetadata as jest.Mock<
            typeof buildContainerModuleFactoryMetadata
          >
        ).mockReturnValueOnce(nestedContainerModuleMetadataFixture);

        (
          buildContainerModuleClassMetadata as jest.Mock<
            typeof buildContainerModuleClassMetadata
          >
        ).mockReturnValueOnce(containerModuleMetadataFixture);

        result = buildContainerModuleMetadataArray({
          ...containerModuleMetadataApiFixture,
          imports: [nestedContainerModuleMetadataApiFixture],
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return ContainerModuleMetadata[]', () => {
        const expected: ContainerModuleMetadata[] = [
          nestedContainerModuleMetadataFixture,
          containerModuleMetadataFixture,
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
