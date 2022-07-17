import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('@cuaklabs/iocuak-metadata');

import { Newable } from '@cuaklabs/iocuak-common';
import {
  getDefaultClassMetadata,
  getReflectMetadata,
  MetadataKey,
  updateReflectMetadata,
} from '@cuaklabs/iocuak-metadata';

import { injectFrom } from '../../classMetadata/decorators/injectFrom';
import { ClassMetadataExtensionApi } from '../../classMetadata/models/api/ClassMetadataExtensionApi';
import { ClassMetadataFixtures } from '../fixtures/domain/ClassMetadataFixtures';

describe(injectFrom.name, () => {
  describe('when called, and getReflectMetadata() returns undefined', () => {
    let classMetadataExtensionApiFixture: ClassMetadataExtensionApi;

    beforeAll(() => {
      classMetadataExtensionApiFixture = {
        type: class {},
      };

      injectFrom(classMetadataExtensionApiFixture)(class {});
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        classMetadataExtensionApiFixture.type,
        MetadataKey.inject,
      );
    });

    it('should not call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).not.toHaveBeenCalled();
    });
  });

  describe('when called, and getReflectMetadata() returns metadata', () => {
    let classMetadataExtensionApiFixture: ClassMetadataExtensionApi;
    let typeFixture: Newable;

    beforeAll(() => {
      classMetadataExtensionApiFixture = {
        type: class {},
      };

      (
        getReflectMetadata as jestMock.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(ClassMetadataFixtures.any);

      typeFixture = class {};

      injectFrom(classMetadataExtensionApiFixture)(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        classMetadataExtensionApiFixture.type,
        MetadataKey.inject,
      );
    });

    it('should call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateReflectMetadata).toHaveBeenCalledWith(
        typeFixture,
        MetadataKey.inject,
        getDefaultClassMetadata(),
        expect.any(Function),
      );
    });
  });
});
