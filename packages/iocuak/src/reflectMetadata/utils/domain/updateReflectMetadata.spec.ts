import 'reflect-metadata';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./getReflectMetadata');

import { Newable } from '../../../common/models/domain/Newable';
import { getReflectMetadata } from './getReflectMetadata';
import { updateReflectMetadata } from './updateReflectMetadata';

describe(updateReflectMetadata.name, () => {
  describe('when called, and getReflectMetadata returns undefined', () => {
    let targetFixture: Newable;
    let metadataKeyFixture: unknown;
    let defaultValueFixture: unknown;
    let callbackMock: jestMock.Mock<(value: unknown) => unknown>;
    let reflectMetadata: unknown;

    beforeAll(() => {
      targetFixture = class {};
      metadataKeyFixture = 'sample-key';
      defaultValueFixture = 'default-value';
      callbackMock = jest
        .fn<(value: unknown) => unknown>()
        .mockImplementationOnce((value: unknown) => value);

      (
        getReflectMetadata as jestMock.Mock<typeof getReflectMetadata>
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
    let targetFixture: Newable;
    let metadataFixture: unknown;
    let metadataKeyFixture: unknown;
    let defaultValueFixture: unknown;
    let callbackMock: jestMock.Mock<(value: unknown) => unknown>;
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
        getReflectMetadata as jestMock.Mock<typeof getReflectMetadata>
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
