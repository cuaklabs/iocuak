import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../foundation/calculations/hashString');

import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { hashString } from '../../../foundation/calculations/hashString';
import { buildContainerModuleContainerModuleMetadataId } from './buildContainerModuleContainerModuleMetadataId';

describe(buildContainerModuleContainerModuleMetadataId.name, () => {
  let containerModuleApiFixture: ContainerModuleApi;

  beforeAll(() => {
    containerModuleApiFixture = {
      load: () => {
        /* comment */ return undefined;
      },
    };
  });

  describe('when called', () => {
    let hashFixture: string;
    let result: unknown;

    beforeAll(() => {
      (hashString as jest.Mock<typeof hashString>).mockReturnValueOnce(
        hashFixture,
      );

      result = buildContainerModuleContainerModuleMetadataId(
        containerModuleApiFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call hashString()', () => {
      expect(hashString).toHaveBeenCalledTimes(1);
      expect(hashString).toHaveBeenCalledWith(
        containerModuleApiFixture.load.toString(),
      );
    });

    it('should return a ContainerModuleMetadaId', () => {
      expect(result).toBe(hashFixture);
    });
  });
});
