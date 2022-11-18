import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cuaklabs/iocuak-models');
jest.mock('@cuaklabs/iocuak-reflect-metadata-utils');

import { Newable } from '@cuaklabs/iocuak-common';
import {
  ClassMetadata,
  classMetadataReflectKey,
  getDefaultClassMetadata,
} from '@cuaklabs/iocuak-models';
import { getReflectMetadata } from '@cuaklabs/iocuak-reflect-metadata-utils';

import { ClassMetadataFixtures } from '../fixtures/ClassMetadataFixtures';
import { getClassMetadata } from './getClassMetadata';

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
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(undefined);

      (
        getDefaultClassMetadata as jest.Mock<typeof getDefaultClassMetadata>
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
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
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
