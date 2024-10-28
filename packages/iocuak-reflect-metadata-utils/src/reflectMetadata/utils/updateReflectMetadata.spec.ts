import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import 'reflect-metadata';

jest.mock('./getReflectMetadata');

import { getReflectMetadata } from './getReflectMetadata';
import { updateReflectMetadata } from './updateReflectMetadata';

describe(updateReflectMetadata.name, () => {
  describe('when called, and getReflectMetadata returns undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    let targetFixture: Function;
    let metadataKeyFixture: unknown;
    let defaultValueFixture: unknown;
    let callbackMock: jest.Mock<(value: unknown) => unknown>;
    let reflectMetadata: unknown;

    beforeAll(() => {
      targetFixture = class {};
      metadataKeyFixture = 'sample-key';
      defaultValueFixture = 'default-value';
      callbackMock = jest
        .fn<(value: unknown) => unknown>()
        .mockImplementationOnce((value: unknown) => value);

      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(undefined);

      updateReflectMetadata(
        targetFixture,
        metadataKeyFixture,
        defaultValueFixture,
        callbackMock,
      );

      reflectMetadata = Reflect.getOwnMetadata(
        metadataKeyFixture,
        targetFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        metadataKeyFixture,
      );
    });

    it('should call callback()', () => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(defaultValueFixture);
    });

    it('should define metadata', () => {
      expect(reflectMetadata).toBe(defaultValueFixture);
    });
  });

  describe('when called, and getReflectMetadata returns metadata', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    let targetFixture: Function;
    let metadataFixture: unknown;
    let metadataKeyFixture: unknown;
    let defaultValueFixture: unknown;
    let callbackMock: jest.Mock<(value: unknown) => unknown>;
    let reflectMetadata: unknown;

    beforeAll(() => {
      targetFixture = class {};
      metadataFixture = 'metadata';
      metadataKeyFixture = 'sample-key';
      defaultValueFixture = 'default-value';
      callbackMock = jest
        .fn<(value: unknown) => unknown>()
        .mockImplementationOnce((value: unknown) => value);

      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(metadataFixture);

      updateReflectMetadata(
        targetFixture,
        metadataKeyFixture,
        defaultValueFixture,
        callbackMock,
      );

      reflectMetadata = Reflect.getOwnMetadata(
        metadataKeyFixture,
        targetFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        metadataKeyFixture,
      );
    });

    it('should call callback()', () => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(metadataFixture);
    });

    it('should define metadata', () => {
      expect(reflectMetadata).toBe(metadataFixture);
    });
  });
});
