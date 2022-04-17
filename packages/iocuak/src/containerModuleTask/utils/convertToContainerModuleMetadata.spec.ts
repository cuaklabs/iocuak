jest.mock('./convertToContainerModule');
jest.mock('./convertToContainerModuleAsync');

import { ContainerModuleApi } from '../../container/modules/api/ContainerModuleApi';
import { ContainerModule } from '../../container/modules/domain/ContainerModule';
import { ContainerModuleMetadataApiMocks } from '../mocks/models/api/ContainerModuleMetadataApiMocks';
import { ContainerModuleMetadataApi } from '../models/api/ContainerModuleMetadataApi';
import { ContainerModuleMetadata } from '../models/domain/ContainerModuleMetadata';
import { convertToContainerModule } from './convertToContainerModule';
import { convertToContainerModuleAsync } from './convertToContainerModuleAsync';
import { convertToContainerModuleMetadata } from './convertToContainerModuleMetadata';

describe(convertToContainerModuleMetadata.name, () => {
  describe('having a ContainerModuleMetadataApiMocks with imports', () => {
    let containerModuleMetadataApiImportMock: jest.Mocked<ContainerModuleMetadataApi>;
    let containerModuleMetadataApiMock: jest.Mocked<ContainerModuleMetadataApi>;

    beforeAll(() => {
      containerModuleMetadataApiImportMock =
        ContainerModuleMetadataApiMocks.any;
      containerModuleMetadataApiMock = {
        ...ContainerModuleMetadataApiMocks.any,
        imports: [containerModuleMetadataApiImportMock],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleMetadataApiMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleMetadata = {
          factory: expect.any(Function) as ContainerModuleMetadata['factory'],
          imports: [
            {
              factory: expect.any(
                Function,
              ) as ContainerModuleMetadata['factory'],
              imports: expect.any(Array) as ContainerModuleMetadata[],
              injects: [...containerModuleMetadataApiImportMock.injects],
            },
          ],
          injects: [...containerModuleMetadataApiMock.injects],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('when called', () => {
    let containerModuleMetadataApiMock: jest.Mocked<ContainerModuleMetadataApi>;
    let result: unknown;
    let containerModuleMetadata: ContainerModuleMetadata;

    beforeAll(() => {
      containerModuleMetadataApiMock = ContainerModuleMetadataApiMocks.any;

      result = convertToContainerModuleMetadata(containerModuleMetadataApiMock);

      containerModuleMetadata = result as ContainerModuleMetadata;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a ContainerModuleMetadata', () => {
      const expected: ContainerModuleMetadata = {
        factory: expect.any(Function) as ContainerModuleMetadata['factory'],
        imports: expect.any(Array) as ContainerModuleMetadata[],
        injects: [...containerModuleMetadataApiMock.injects],
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
          convertToContainerModuleAsync as jest.Mock<Promise<ContainerModule>>
        ).mockResolvedValueOnce(containerModuleFixture);

        containerModuleMetadataApiMock.factory.mockResolvedValueOnce(
          containerModuleApiFixture,
        );

        argumentsFixture = [Symbol()];

        result = await containerModuleMetadata.factory(...argumentsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleMetadataApi.factory()', () => {
        expect(containerModuleMetadataApiMock.factory).toHaveBeenCalledTimes(1);
        expect(containerModuleMetadataApiMock.factory).toHaveBeenCalledWith(
          ...argumentsFixture,
        );
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
          convertToContainerModule as jest.Mock<ContainerModule>
        ).mockReturnValueOnce(containerModuleFixture);

        containerModuleMetadataApiMock.factory.mockReturnValueOnce(
          containerModuleApiFixture,
        );

        argumentsFixture = [Symbol()];

        result = containerModuleMetadata.factory(...argumentsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleMetadataApi.factory()', () => {
        expect(containerModuleMetadataApiMock.factory).toHaveBeenCalledTimes(1);
        expect(containerModuleMetadataApiMock.factory).toHaveBeenCalledWith(
          ...argumentsFixture,
        );
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
