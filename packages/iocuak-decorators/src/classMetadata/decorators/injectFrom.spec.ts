import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cuaklabs/iocuak-models');
jest.mock('@cuaklabs/iocuak-reflect-metadata-utils');

import { Newable } from '@cuaklabs/iocuak-common';
import {
  classMetadataReflectKey,
  getDefaultClassMetadata,
} from '@cuaklabs/iocuak-models';
import {
  getReflectMetadata,
  updateReflectMetadata,
} from '@cuaklabs/iocuak-reflect-metadata-utils';

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
        classMetadataReflectKey,
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
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
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
        classMetadataReflectKey,
      );
    });

    it('should call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateReflectMetadata).toHaveBeenCalledWith(
        typeFixture,
        classMetadataReflectKey,
        getDefaultClassMetadata(),
        expect.any(Function),
      );
    });
  });
});
