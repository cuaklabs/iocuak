import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('@cuaklabs/iocuak-metadata');

import { Newable } from '@cuaklabs/iocuak-common';
import {
  ClassMetadata,
  getDefaultClassMetadata,
  getReflectMetadata,
  MetadataKey,
} from '@cuaklabs/iocuak-metadata';

import { ClassMetadataFixtures } from '../../../classMetadata/fixtures/domain/ClassMetadataFixtures';
import { MetadataServiceImplementation } from './MetadataServiceImplementation';

describe(MetadataServiceImplementation.name, () => {
  let metadataServiceImplementation: MetadataServiceImplementation;

  beforeAll(() => {
    metadataServiceImplementation = new MetadataServiceImplementation();
  });

  describe('.getBindingMetadata', () => {
    describe('when called', () => {
      let typeFixture: Newable;

      beforeAll(() => {
        typeFixture = class {};

        metadataServiceImplementation.getBindingMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getReflectMetadata()', () => {
        expect(getReflectMetadata).toHaveBeenCalledTimes(1);
        expect(getReflectMetadata).toHaveBeenCalledWith(
          typeFixture,
          MetadataKey.injectable,
        );
      });
    });
  });

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
          getDefaultClassMetadata as jestMock.Mock<
            typeof getDefaultClassMetadata
          >
        ).mockReturnValueOnce(classMetadataFixture);

        result = metadataServiceImplementation.getClassMetadata(typeFixture);
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

        result = metadataServiceImplementation.getClassMetadata(typeFixture);
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
        expect(result).toStrictEqual(
          ClassMetadataFixtures.withConstructorArgumentsServiceAndPropertiesService,
        );
      });
    });
  });
});
