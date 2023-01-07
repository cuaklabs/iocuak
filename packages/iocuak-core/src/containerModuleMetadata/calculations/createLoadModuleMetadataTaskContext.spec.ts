import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../createInstanceTask/calculations/createInstanceTaskContext');
jest.mock('./getContainerModuleMetadataId');

import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { createInstanceTaskContext } from '../../createInstanceTask/calculations/createInstanceTaskContext';
import { CreateInstanceTaskContextMocks } from '../../createInstanceTask/mocks/models/CreateInstanceTaskContextMocks';
import { TaskContextServices } from '../../createInstanceTask/models/TaskContextServices';
import { ContainerModuleMetadataMocks } from '../mocks/models/ContainerModuleMetadataMocks';
import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { createLoadModuleMetadataTaskContext } from './createLoadModuleMetadataTaskContext';
import { getContainerModuleMetadataId } from './getContainerModuleMetadataId';

describe(createLoadModuleMetadataTaskContext.name, () => {
  let requestIdFixture: symbol;
  let servicesFixture: TaskContextServices;

  beforeAll(() => {
    requestIdFixture = Symbol();
    servicesFixture = Symbol() as unknown as TaskContextServices;
  });

  describe('having a ContainerModuleMetadata[] with one element', () => {
    let containerModuleMetadataArrayFixture: [ContainerModuleMetadata];

    beforeAll(() => {
      containerModuleMetadataArrayFixture = [ContainerModuleMetadataMocks.any];
    });

    describe('when called, and getContainerModuleMetadataId returns undefined', () => {
      let expectedLoadModuleMetadataTaskContextProperties: Partial<LoadModuleMetadataTaskContext>;
      let result: unknown;

      beforeAll(() => {
        expectedLoadModuleMetadataTaskContextProperties = {
          containerModuleMetadataIdToContainerModuleMetadataMap: new Map(),
          containerModulesLoadedSet: new Set(),
        };

        (
          createInstanceTaskContext as jest.Mock<
            typeof createInstanceTaskContext
          >
        ).mockReturnValueOnce(CreateInstanceTaskContextMocks.any);

        (
          getContainerModuleMetadataId as jest.Mock<
            typeof getContainerModuleMetadataId
          >
        ).mockReturnValueOnce(undefined);

        result = createLoadModuleMetadataTaskContext(
          requestIdFixture,
          servicesFixture,
          containerModuleMetadataArrayFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createInstanceTaskContext()', () => {
        expect(createInstanceTaskContext).toHaveBeenCalledTimes(1);
        expect(createInstanceTaskContext).toHaveBeenCalledWith(
          requestIdFixture,
          servicesFixture,
        );
      });

      it('should call getContainerModuleMetadataId()', () => {
        expect(getContainerModuleMetadataId).toHaveBeenCalledTimes(1);
        expect(getContainerModuleMetadataId).toHaveBeenCalledWith(
          containerModuleMetadataArrayFixture[0],
        );
      });

      it('should a LoadModuleMetadataTaskContext', () => {
        expect(result).toStrictEqual(
          expect.objectContaining(
            expectedLoadModuleMetadataTaskContextProperties,
          ),
        );
      });
    });

    describe('when called, and getContainerModuleMetadataId returns a ContainerModuleMetadataId', () => {
      let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
      let expectedLoadModuleMetadataTaskContextProperties: Partial<LoadModuleMetadataTaskContext>;

      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataIdFixture = Symbol();

        expectedLoadModuleMetadataTaskContextProperties = {
          containerModuleMetadataIdToContainerModuleMetadataMap: new Map([
            [
              containerModuleMetadataIdFixture,
              containerModuleMetadataArrayFixture[0],
            ],
          ]),
          containerModulesLoadedSet: new Set(),
        };

        (
          createInstanceTaskContext as jest.Mock<
            typeof createInstanceTaskContext
          >
        ).mockReturnValueOnce(CreateInstanceTaskContextMocks.any);

        (
          getContainerModuleMetadataId as jest.Mock<
            typeof getContainerModuleMetadataId
          >
        ).mockReturnValueOnce(containerModuleMetadataIdFixture);

        result = createLoadModuleMetadataTaskContext(
          requestIdFixture,
          servicesFixture,
          containerModuleMetadataArrayFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createInstanceTaskContext()', () => {
        expect(createInstanceTaskContext).toHaveBeenCalledTimes(1);
        expect(createInstanceTaskContext).toHaveBeenCalledWith(
          requestIdFixture,
          servicesFixture,
        );
      });

      it('should call getContainerModuleMetadataId()', () => {
        expect(getContainerModuleMetadataId).toHaveBeenCalledTimes(1);
        expect(getContainerModuleMetadataId).toHaveBeenCalledWith(
          containerModuleMetadataArrayFixture[0],
        );
      });

      it('should a LoadModuleMetadataTaskContext', () => {
        expect(result).toStrictEqual(
          expect.objectContaining(
            expectedLoadModuleMetadataTaskContextProperties,
          ),
        );
      });
    });
  });
});
