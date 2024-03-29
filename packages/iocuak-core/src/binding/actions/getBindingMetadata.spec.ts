import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cuaklabs/iocuak-reflect-metadata-utils');

import { Newable } from '@cuaklabs/iocuak-common';
import { bindingReflectKey } from '@cuaklabs/iocuak-models';
import { getReflectMetadata } from '@cuaklabs/iocuak-reflect-metadata-utils';

import { getBindingMetadata } from './getBindingMetadata';

describe(getBindingMetadata.name, () => {
  describe('when called', () => {
    let typeFixture: Newable;

    beforeAll(() => {
      typeFixture = class {};

      getBindingMetadata(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        typeFixture,
        bindingReflectKey,
      );
    });
  });
});
