import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./getDefaultClassMetadata');
jest.mock('@cuaklabs/iocuak-reflect-metadata-utils');

import { Newable } from '@cuaklabs/iocuak-common';
import { getReflectMetadata } from '@cuaklabs/iocuak-reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/models/classMetadataReflectKey';
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
        classMetadataReflectKey,
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
        classMetadataReflectKey,
      );
    });

    it('should return ClassMetadata', () => {
      expect(result).toStrictEqual(classMetadataFixture);
    });
  });
});
