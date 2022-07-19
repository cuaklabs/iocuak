import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./getDefaultClassMetadata');
jest.mock('../../reflectMetadata/utils/getReflectMetadata');

import { Newable } from '@cuaklabs/iocuak-common';

import { MetadataKey } from '../../reflectMetadata/models/MetadataKey';
import { getReflectMetadata } from '../../reflectMetadata/utils/getReflectMetadata';
import { ClassMetadataFixtures } from '../fixtures/ClassMetadataFixtures';
import { ClassMetadata } from '../models/ClassMetadata';
import { getClassMetadata } from './getClassMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';

describe('.getClassMetadata()', () => {
  describe('when called, and getReflectMetadata returns undefined', () => {
    let typeFixture: Newable;
    let classMetadataFixture: ClassMetadata;

    let result: unknown;

    beforeAll(() => {
      typeFixture = class {};
      classMetadataFixture = {
        constructorArguments: [],
        properties: new Map(),
      };

      (
        getReflectMetadata as jestMock.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(undefined);

      (
        getDefaultClassMetadata as jestMock.Mock<typeof getDefaultClassMetadata>
      ).mockReturnValueOnce(classMetadataFixture);

      result = getClassMetadata(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        typeFixture,
        MetadataKey.inject,
      );
    });

    it('should call getDefaultClassMetadata', () => {
      expect(getDefaultClassMetadata).toHaveBeenCalledTimes(1);
    });

    it('should return ClassMetadata', () => {
      expect(result).toBe(classMetadataFixture);
    });
  });

  describe('when called, and getReflectMetadata returns ClassMetadata', () => {
    let typeFixture: Newable;
    let classMetadataFixture: ClassMetadata;

    let result: unknown;

    beforeAll(() => {
      typeFixture = class {};
      classMetadataFixture =
        ClassMetadataFixtures.withConstructorArgumentsServiceAndPropertiesService;

      (
        getReflectMetadata as jestMock.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(classMetadataFixture);

      result = getClassMetadata(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        typeFixture,
        MetadataKey.inject,
      );
    });

    it('should return ClassMetadata', () => {
      expect(result).toStrictEqual(classMetadataFixture);
    });
  });
});
