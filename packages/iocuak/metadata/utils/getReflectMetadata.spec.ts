import 'reflect-metadata';

import { Newable } from '../../common/models/domain/Newable';
import { getReflectMetadata } from './getReflectMetadata';

describe(getReflectMetadata.name, () => {
  describe('when called, and no metadata is registered', () => {
    let result: unknown;

    beforeAll(() => {
      result = getReflectMetadata(class {}, 'sample-key');
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and metadata is registered', () => {
    let result: unknown;

    let metadataFixture: unknown;

    beforeAll(() => {
      metadataFixture = 'sample-metadata';

      const targetFixture: Newable = class {};
      const metadataKeyFixture: unknown = 'sample-key';

      Reflect.defineMetadata(
        metadataKeyFixture,
        metadataFixture,
        targetFixture,
      );

      result = getReflectMetadata(targetFixture, metadataKeyFixture);
    });

    it('should return metadata', () => {
      expect(result).toBe(metadataFixture);
    });
  });
});
