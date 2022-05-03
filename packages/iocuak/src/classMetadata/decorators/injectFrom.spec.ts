jest.mock('../../reflectMetadata/utils/domain/getReflectMetadata');
jest.mock('../../reflectMetadata/utils/domain/updateReflectMetadata');

import { injectFrom } from '../../classMetadata/decorators/injectFrom';
import { ClassMetadataExtensionApi } from '../../classMetadata/models/api/ClassMetadataExtensionApi';
import { ClassMetadata } from '../../classMetadata/models/domain/ClassMetadata';
import { getDefaultClassMetadata } from '../../classMetadata/utils/domain/getDefaultClassMetadata';
import { Newable } from '../../common/models/domain/Newable';
import { MetadataKey } from '../../reflectMetadata/models/domain/MetadataKey';
import { getReflectMetadata } from '../../reflectMetadata/utils/domain/getReflectMetadata';
import { updateReflectMetadata } from '../../reflectMetadata/utils/domain/updateReflectMetadata';
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
