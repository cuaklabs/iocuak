jest.mock('../utils/getReflectMetadata');
jest.mock('../utils/updateReflectMetadata');

import { Newable } from '../../common/models/domain/Newable';
import { ClassMetadataFixtures } from '../fixtures/domain/ClassMetadataFixtures';
import { ClassMetadataExtensionApi } from '../models/api/ClassMetadataExtensionApi';
import { ClassMetadata } from '../models/domain/ClassMetadata';
import { MetadataKey } from '../models/domain/MetadataKey';
import { getReflectMetadata } from '../utils/getReflectMetadata';
import { updateReflectMetadata } from '../utils/updateReflectMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';
import { injectFrom } from './injectFrom';

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

      (getReflectMetadata as jest.Mock<ClassMetadata>).mockReturnValueOnce(
        ClassMetadataFixtures.any,
      );

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
