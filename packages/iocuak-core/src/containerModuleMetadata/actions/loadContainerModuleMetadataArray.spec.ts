import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./loadContainerModuleMetadata');

import { ContainerModule } from '../../containerModule/models/ContainerModule';
import { ContainerModuleMetadataMocks } from '../mocks/models/ContainerModuleMetadataMocks';
import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadContainerModuleMetadata } from './loadContainerModuleMetadata';
import { loadContainerModuleMetadataArray } from './loadContainerModuleMetadataArray';

describe(loadContainerModuleMetadataArray.name, () => {
  describe('having a LoadModuleMetadataTaskContext', () => {
    let loadModuleMetadataTaskContextMock: jest.Mocked<LoadModuleMetadataTaskContext>;

    beforeAll(() => {
      loadModuleMetadataTaskContextMock = {
        getZeroDependenciesMetadata: jest.fn(),
        isMetadataArrayLoadable: jest.fn(),
        processMetadataLoaded: jest.fn(),
      } as Partial<
        jest.Mocked<LoadModuleMetadataTaskContext>
      > as jest.Mocked<LoadModuleMetadataTaskContext>;
    });

    describe('when called, and context.isMetadataArrayLoadable() returns false', () => {
      let result: unknown;

      beforeAll(async () => {
        loadModuleMetadataTaskContextMock.isMetadataArrayLoadable.mockReturnValueOnce(
          false,
        );

        try {
          await loadContainerModuleMetadataArray(
            loadModuleMetadataTaskContextMock,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call loadModuleMetadataTaskContext.isMetadataArrayLoadable()', () => {
        expect(
          loadModuleMetadataTaskContextMock.isMetadataArrayLoadable,
        ).toHaveBeenCalledTimes(1);

        expect(
          loadModuleMetadataTaskContextMock.isMetadataArrayLoadable,
        ).toHaveBeenCalledWith();
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<Error> = {
          message:
            'Metadata provided is not loadable. Ensure all the container module metadata ids are correctly referenced and there are no circular references',
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and context.isMetadataArrayLoadable() returns true and context.getZeroDependenciesMetadata() returns an empty array', () => {
      beforeAll(async () => {
        loadModuleMetadataTaskContextMock.isMetadataArrayLoadable.mockReturnValueOnce(
          true,
        );

        loadModuleMetadataTaskContextMock.getZeroDependenciesMetadata.mockReturnValueOnce(
          [],
        );

        await loadContainerModuleMetadataArray(
          loadModuleMetadataTaskContextMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call loadModuleMetadataTaskContext.isMetadataArrayLoadable()', () => {
        expect(
          loadModuleMetadataTaskContextMock.isMetadataArrayLoadable,
        ).toHaveBeenCalledTimes(1);

        expect(
          loadModuleMetadataTaskContextMock.isMetadataArrayLoadable,
        ).toHaveBeenCalledWith();
      });

      it('should call loadModuleMetadataTaskContext.getZeroDependenciesMetadata()', () => {
        expect(
          loadModuleMetadataTaskContextMock.getZeroDependenciesMetadata,
        ).toHaveBeenCalledTimes(1);

        expect(
          loadModuleMetadataTaskContextMock.getZeroDependenciesMetadata,
        ).toHaveBeenCalledWith();
      });
    });

    describe('when called, and context.isMetadataArrayLoadable() returns true and context.getZeroDependenciesMetadata() returns an array with metadata', () => {
      beforeAll(async () => {
        loadModuleMetadataTaskContextMock.isMetadataArrayLoadable
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        loadModuleMetadataTaskContextMock.getZeroDependenciesMetadata
          .mockReturnValueOnce([ContainerModuleMetadataMocks.any])
          .mockReturnValueOnce([]);

        (
          loadContainerModuleMetadata as jest.Mock<
            typeof loadContainerModuleMetadata
          >
        ).mockReturnValueOnce(undefined);

        await loadContainerModuleMetadataArray(
          loadModuleMetadataTaskContextMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call loadModuleMetadataTaskContext.isMetadataArrayLoadable()', () => {
        expect(
          loadModuleMetadataTaskContextMock.isMetadataArrayLoadable,
        ).toHaveBeenCalledTimes(1);

        expect(
          loadModuleMetadataTaskContextMock.isMetadataArrayLoadable,
        ).toHaveBeenCalledWith();
      });

      it('should call loadModuleMetadataTaskContext.getZeroDependenciesMetadata()', () => {
        expect(
          loadModuleMetadataTaskContextMock.getZeroDependenciesMetadata,
        ).toHaveBeenCalledTimes(2);

        expect(
          loadModuleMetadataTaskContextMock.getZeroDependenciesMetadata,
        ).toHaveBeenNthCalledWith(1);
        expect(
          loadModuleMetadataTaskContextMock.getZeroDependenciesMetadata,
        ).toHaveBeenNthCalledWith(2);
      });

      it('should call loadContainerModuleMetadata()', () => {
        const expected: ContainerModuleMetadata = {
          ...ContainerModuleMetadataMocks.any,
          factory: expect.any(Function) as unknown as (
            ...args: unknown[]
          ) => ContainerModule | Promise<ContainerModule>,
        };

        expect(loadContainerModuleMetadata).toHaveBeenCalledTimes(1);
        expect(loadContainerModuleMetadata).toHaveBeenCalledWith(
          expected,
          expect.any(Object),
        );
      });

      it('should call processMetadataLoaded()', () => {
        const expected: ContainerModuleMetadata = {
          ...ContainerModuleMetadataMocks.any,
          factory: expect.any(Function) as unknown as (
            ...args: unknown[]
          ) => ContainerModule | Promise<ContainerModule>,
        };

        expect(
          loadModuleMetadataTaskContextMock.processMetadataLoaded,
        ).toHaveBeenCalledTimes(1);
        expect(
          loadModuleMetadataTaskContextMock.processMetadataLoaded,
        ).toHaveBeenCalledWith(expected);
      });
    });
  });
});
