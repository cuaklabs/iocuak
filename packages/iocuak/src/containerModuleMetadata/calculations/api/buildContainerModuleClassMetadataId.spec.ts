import { beforeAll, describe, expect, it } from '@jest/globals';

import { ContainerModuleMetadataApiMocks } from '../../mocks/models/api/ContainerModuleMetadataApiMocks';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { buildContainerModuleClassMetadataId } from './buildContainerModuleClassMetadataId';

describe(buildContainerModuleClassMetadataId.name, () => {
  describe('having metadata with no id', () => {
    let metadataFixture: ContainerModuleClassMetadataApi;

    beforeAll(() => {
      metadataFixture =
        ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildContainerModuleClassMetadataId(metadataFixture);
      });

      it('should return a ContainerModuleMetadataId', () => {
        expect(result).toBe(metadataFixture.module);
      });
    });
  });

  describe('having metadata with id', () => {
    let metadataFixture: ContainerModuleClassMetadataApi;

    beforeAll(() => {
      metadataFixture =
        ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApiWithId;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildContainerModuleClassMetadataId(metadataFixture);
      });

      it('should return a ContainerModuleMetadataId', () => {
        expect(result).toBe(metadataFixture.id);
      });
    });
  });
});
