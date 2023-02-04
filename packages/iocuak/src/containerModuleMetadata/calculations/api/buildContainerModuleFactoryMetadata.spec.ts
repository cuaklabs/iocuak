import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../containerModule/utils/api/convertToContainerModule');
jest.mock('../../../containerModule/utils/api/convertToContainerModuleAsync');
jest.mock('./buildContainerModuleFactoryMetadataId');

import { ContainerModuleMetadataId, ServiceId } from '@cuaklabs/iocuak-common';
import {
  ContainerModule,
  ContainerModuleFactoryMetadata,
  ContainerModuleMetadata,
  ContainerModuleMetadataType,
} from '@cuaklabs/iocuak-core';
import {
  ClassElementMetadata,
  ClassElementMetadataType,
} from '@cuaklabs/iocuak-models';
import {
  ClassElementServiceIdMetadataApi,
  ClassElementTagMetadataApi,
} from '@cuaklabs/iocuak-models-api';

import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { convertToContainerModule } from '../../../containerModule/utils/api/convertToContainerModule';
import { convertToContainerModuleAsync } from '../../../containerModule/utils/api/convertToContainerModuleAsync';
import { ContainerModuleMetadataApiMocks } from '../../mocks/models/api/ContainerModuleMetadataApiMocks';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { buildContainerModuleFactoryMetadata } from './buildContainerModuleFactoryMetadata';
import { buildContainerModuleFactoryMetadataId } from './buildContainerModuleFactoryMetadataId';

describe(buildContainerModuleFactoryMetadata.name, () => {
  describe('having a ContainerModuleFactoryMetadataApi', () => {
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi;
    });

    describe('when called', () => {
      let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
      let requiredMetadataIdFixture: ContainerModuleMetadataId[];
      let result: unknown;
      let containerModuleMetadata: ContainerModuleFactoryMetadata;

      beforeAll(() => {
        containerModuleMetadataIdFixture = 'metadata-id';

        requiredMetadataIdFixture = [Symbol()];

        (
          buildContainerModuleFactoryMetadataId as jest.Mock<
            typeof buildContainerModuleFactoryMetadataId
          >
        ).mockReturnValueOnce(containerModuleMetadataIdFixture);

        result = buildContainerModuleFactoryMetadata(
          containerModuleFactoryMetadataApiMock,
          requiredMetadataIdFixture,
        );

        containerModuleMetadata = result as ContainerModuleFactoryMetadata;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleFactoryMetadataId()', () => {
        const expected: ContainerModuleFactoryMetadataApi = {
          factory: expect.any(Function) as unknown as (
            ...args: unknown[]
          ) => ContainerModuleApi | Promise<ContainerModuleApi>,
        };

        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          id: containerModuleMetadataIdFixture,
          injects: expect.any(Array) as unknown as ClassElementMetadata[],
          requires: requiredMetadataIdFixture,
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });

      describe('when factory is called and containerModuleMetadataApi.factory returns a promise', () => {
        let containerModuleApiFixture: ContainerModuleApi;
        let containerModuleFixture: ContainerModule;
        let argumentsFixture: unknown[];
        let result: unknown;

        beforeAll(async () => {
          containerModuleApiFixture = {
            _tag: 'containerModuleApi',
          } as unknown as ContainerModuleApi;

          containerModuleFixture = {
            _tag: 'containerModule',
          } as unknown as ContainerModule;

          (
            convertToContainerModuleAsync as jest.Mock<
              typeof convertToContainerModuleAsync
            >
          ).mockResolvedValueOnce(containerModuleFixture);

          (
            containerModuleFactoryMetadataApiMock.factory as jest.Mock<
              () => Promise<ContainerModuleApi>
            >
          ).mockResolvedValueOnce(containerModuleApiFixture);

          argumentsFixture = [Symbol()];

          result = await containerModuleMetadata.factory(...argumentsFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerModuleMetadataApi.factory()', () => {
          expect(
            containerModuleFactoryMetadataApiMock.factory,
          ).toHaveBeenCalledTimes(1);
          expect(
            containerModuleFactoryMetadataApiMock.factory,
          ).toHaveBeenCalledWith(...argumentsFixture);
        });

        it('should call convertToContainerModuleAsync()', () => {
          expect(convertToContainerModuleAsync).toHaveBeenCalledTimes(1);
          expect(convertToContainerModuleAsync).toHaveBeenCalledWith(
            Promise.resolve(containerModuleApiFixture),
          );
        });

        it('should return a ContainerModule', () => {
          expect(result).toBe(containerModuleFixture);
        });
      });

      describe('when factory is called and containerModuleMetadataApi.factory returns a non promise', () => {
        let containerModuleApiFixture: ContainerModuleApi;
        let containerModuleFixture: ContainerModule;
        let argumentsFixture: unknown[];
        let result: unknown;

        beforeAll(() => {
          containerModuleApiFixture = {
            _tag: 'containerModuleApi',
          } as unknown as ContainerModuleApi;

          containerModuleFixture = {
            _tag: 'containerModule',
          } as unknown as ContainerModule;

          (
            convertToContainerModule as jest.Mock<
              typeof convertToContainerModule
            >
          ).mockReturnValueOnce(containerModuleFixture);

          containerModuleFactoryMetadataApiMock.factory.mockReturnValueOnce(
            containerModuleApiFixture,
          );

          argumentsFixture = [Symbol()];

          result = containerModuleMetadata.factory(...argumentsFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerModuleMetadataApi.factory()', () => {
          expect(
            containerModuleFactoryMetadataApiMock.factory,
          ).toHaveBeenCalledTimes(1);
          expect(
            containerModuleFactoryMetadataApiMock.factory,
          ).toHaveBeenCalledWith(...argumentsFixture);
        });

        it('should call convertToContainerModule()', () => {
          expect(convertToContainerModule).toHaveBeenCalledTimes(1);
          expect(convertToContainerModule).toHaveBeenCalledWith(
            containerModuleApiFixture,
          );
        });

        it('should return a ContainerModule', () => {
          expect(result).toBe(containerModuleFixture);
        });
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with ServiceId injects', () => {
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.withInjectsServiceId;
    });

    describe('when called', () => {
      let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
      let requiredMetadataIdFixture: ContainerModuleMetadataId[];
      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataIdFixture = 'metadata-id';

        requiredMetadataIdFixture = [Symbol()];

        (
          buildContainerModuleFactoryMetadataId as jest.Mock<
            typeof buildContainerModuleFactoryMetadataId
          >
        ).mockReturnValueOnce(containerModuleMetadataIdFixture);

        result = buildContainerModuleFactoryMetadata(
          containerModuleFactoryMetadataApiMock,
          requiredMetadataIdFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleFactoryMetadataId()', () => {
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledWith(
          containerModuleFactoryMetadataApiMock,
        );
      });

      it('should return a ContainerModuleMetadata', () => {
        const expectedInjects: ClassElementMetadata[] = (
          containerModuleFactoryMetadataApiMock.injects as ServiceId[]
        ).map(
          (serviceId: ServiceId): ClassElementMetadata => ({
            type: ClassElementMetadataType.serviceId,
            value: serviceId,
          }),
        );

        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          id: containerModuleMetadataIdFixture,
          injects: expectedInjects,
          requires: requiredMetadataIdFixture,
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with ClassElementServiceIdMetadata injects', () => {
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.withInjectsClassElementServiceIdMetadata;
    });

    describe('when called', () => {
      let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
      let requiredMetadataIdFixture: ContainerModuleMetadataId[];
      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataIdFixture = 'metadata-id';

        requiredMetadataIdFixture = [Symbol()];

        (
          buildContainerModuleFactoryMetadataId as jest.Mock<
            typeof buildContainerModuleFactoryMetadataId
          >
        ).mockReturnValueOnce(containerModuleMetadataIdFixture);

        result = buildContainerModuleFactoryMetadata(
          containerModuleFactoryMetadataApiMock,
          requiredMetadataIdFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleFactoryMetadataId()', () => {
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledWith(
          containerModuleFactoryMetadataApiMock,
        );
      });

      it('should return a ContainerModuleMetadata', () => {
        const expectedInjects: ClassElementMetadata[] = (
          containerModuleFactoryMetadataApiMock.injects as ClassElementServiceIdMetadataApi[]
        ).map(
          (
            classElementMetadataApi: ClassElementServiceIdMetadataApi,
          ): ClassElementMetadata => ({
            type: ClassElementMetadataType.serviceId,
            value: classElementMetadataApi.value,
          }),
        );

        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          id: containerModuleMetadataIdFixture,
          injects: expectedInjects,
          requires: requiredMetadataIdFixture,
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with ClassElementTagMetadata injects', () => {
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.withInjectsClassElementTagMetadata;
    });

    describe('when called', () => {
      let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
      let requiredMetadataIdFixture: ContainerModuleMetadataId[];
      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataIdFixture = 'metadata-id';

        requiredMetadataIdFixture = [Symbol()];

        (
          buildContainerModuleFactoryMetadataId as jest.Mock<
            typeof buildContainerModuleFactoryMetadataId
          >
        ).mockReturnValueOnce(containerModuleMetadataIdFixture);

        result = buildContainerModuleFactoryMetadata(
          containerModuleFactoryMetadataApiMock,
          requiredMetadataIdFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleFactoryMetadataId()', () => {
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledWith(
          containerModuleFactoryMetadataApiMock,
        );
      });

      it('should return a ContainerModuleMetadata', () => {
        const expectedInjects: ClassElementMetadata[] = (
          containerModuleFactoryMetadataApiMock.injects as ClassElementTagMetadataApi[]
        ).map(
          (
            classElementMetadataApi: ClassElementTagMetadataApi,
          ): ClassElementMetadata => ({
            type: ClassElementMetadataType.tag,
            value: classElementMetadataApi.value,
          }),
        );

        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          id: containerModuleMetadataIdFixture,
          injects: expectedInjects,
          requires: requiredMetadataIdFixture,
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with no injects', () => {
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.withNoInjects;
    });

    describe('when called', () => {
      let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
      let requiredMetadataIdFixture: ContainerModuleMetadataId[];
      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataIdFixture = 'metadata-id';

        requiredMetadataIdFixture = [Symbol()];

        (
          buildContainerModuleFactoryMetadataId as jest.Mock<
            typeof buildContainerModuleFactoryMetadataId
          >
        ).mockReturnValueOnce(containerModuleMetadataIdFixture);

        result = buildContainerModuleFactoryMetadata(
          containerModuleFactoryMetadataApiMock,
          requiredMetadataIdFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildContainerModuleFactoryMetadataId()', () => {
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledTimes(1);
        expect(buildContainerModuleFactoryMetadataId).toHaveBeenCalledWith(
          containerModuleFactoryMetadataApiMock,
        );
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          id: containerModuleMetadataIdFixture,
          injects: [],
          requires: requiredMetadataIdFixture,
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
