import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock(
  '../../createInstanceTask/calculations/createCreateInstanceTaskContext',
);
jest.mock('./getContainerModuleMetadataId');

import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadataMocks } from '../mocks/models/ContainerModuleMetadataMocks';
import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { createContainerModuleMetadataMap } from './createContainerModuleMetadataMap';
import { getContainerModuleMetadataId } from './getContainerModuleMetadataId';

describe(createContainerModuleMetadataMap.name, () => {
  describe('having a ContainerModuleMetadata[] with one element', () => {
    let containerModuleMetadataArrayFixture: [ContainerModuleMetadata];

    beforeAll(() => {
      containerModuleMetadataArrayFixture = [ContainerModuleMetadataMocks.any];
    });

    describe('when called, and getContainerModuleMetadataId returns undefined', () => {
      let expectedContainerModuleMetadataMap: Map<
        ContainerModuleMetadataId,
        ContainerModuleMetadata
      >;
      let result: unknown;

      beforeAll(() => {
        expectedContainerModuleMetadataMap = new Map();

        (
          getContainerModuleMetadataId as jest.Mock<
            typeof getContainerModuleMetadataId
          >
        ).mockReturnValueOnce(undefined);

        result = createContainerModuleMetadataMap(
          containerModuleMetadataArrayFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getContainerModuleMetadataId()', () => {
        expect(getContainerModuleMetadataId).toHaveBeenCalledTimes(1);
        expect(getContainerModuleMetadataId).toHaveBeenCalledWith(
          containerModuleMetadataArrayFixture[0],
        );
      });

      it('should return a Map', () => {
        expect(result).toStrictEqual(expectedContainerModuleMetadataMap);
      });
    });

    describe('when called, and getContainerModuleMetadataId returns a ContainerModuleMetadataId', () => {
      let containerModuleMetadataIdFixture: ContainerModuleMetadataId;
      let expectedContainerModuleMetadataMap: Map<
        ContainerModuleMetadataId,
        ContainerModuleMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        containerModuleMetadataIdFixture = Symbol();

        expectedContainerModuleMetadataMap = new Map([
          [
            containerModuleMetadataIdFixture,
            containerModuleMetadataArrayFixture[0],
          ],
        ]);

        (
          getContainerModuleMetadataId as jest.Mock<
            typeof getContainerModuleMetadataId
          >
        ).mockReturnValueOnce(containerModuleMetadataIdFixture);

        result = createContainerModuleMetadataMap(
          containerModuleMetadataArrayFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getContainerModuleMetadataId()', () => {
        expect(getContainerModuleMetadataId).toHaveBeenCalledTimes(1);
        expect(getContainerModuleMetadataId).toHaveBeenCalledWith(
          containerModuleMetadataArrayFixture[0],
        );
      });

      it('should a LoadModuleMetadataTaskContext', () => {
        expect(result).toStrictEqual(expectedContainerModuleMetadataMap);
      });
    });
  });
});
