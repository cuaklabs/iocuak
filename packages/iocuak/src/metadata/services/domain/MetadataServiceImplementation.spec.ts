import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cuaklabs/iocuak-metadata');

import { Newable } from '@cuaklabs/iocuak-common';
import { getReflectMetadata, MetadataKey } from '@cuaklabs/iocuak-metadata';

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
});
