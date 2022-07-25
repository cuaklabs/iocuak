import { beforeAll, describe, expect, it } from '@jest/globals';

import { MetadataProviderApi } from './MetadataProviderApi';

describe(MetadataProviderApi.name, () => {
  describe('.build', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = MetadataProviderApi.build();
      });

      it('should return a MetadataProviderApi', () => {
        expect(result).toBeInstanceOf(MetadataProviderApi);
      });
    });
  });
});
