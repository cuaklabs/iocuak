jest.mock('../../services/domain/MetadataServiceImplementation');

import { MetadataServiceImplementation } from '../../services/domain/MetadataServiceImplementation';
import { MetadataProviderApi } from './MetadataProviderApi';

describe(MetadataProviderApi.name, () => {
  describe('.build', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = MetadataProviderApi.build();
      });

      it('should call new MetadataServiceImplementation()', () => {
        expect(MetadataServiceImplementation).toHaveBeenCalledTimes(1);
        expect(MetadataServiceImplementation).toHaveBeenCalledWith();
      });

      it('should return a MetadataProviderApi', () => {
        expect(result).toBeInstanceOf(MetadataProviderApi);
      });
    });
  });
});
