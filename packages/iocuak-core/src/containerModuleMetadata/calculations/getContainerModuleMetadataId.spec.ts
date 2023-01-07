import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ContainerModuleMetadataMocks } from '../mocks/models/ContainerModuleMetadataMocks';
import { ContainerModuleClassMetadata } from '../models/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../models/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { getContainerModuleMetadataId } from './getContainerModuleMetadataId';

describe(getContainerModuleMetadataId.name, () => {
  describe('having a ContainerModuleMetadata with id', () => {
    let containerModuleMetadataFixture: jest.Mocked<ContainerModuleMetadata>;

    beforeAll(() => {
      containerModuleMetadataFixture = ContainerModuleMetadataMocks.withId;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getContainerModuleMetadataId(containerModuleMetadataFixture);
      });

      it('should return the metadata id', () => {
        expect(result).toBe(containerModuleMetadataFixture.id);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadata with no id', () => {
    let containerModuleMetadataFixture: jest.Mocked<ContainerModuleFactoryMetadata>;

    beforeAll(() => {
      containerModuleMetadataFixture =
        ContainerModuleMetadataMocks.withTypeFactory;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getContainerModuleMetadataId(containerModuleMetadataFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a ContainerModuleClassMetadata with no id', () => {
    let containerModuleMetadataFixture: jest.Mocked<ContainerModuleClassMetadata>;

    beforeAll(() => {
      containerModuleMetadataFixture =
        ContainerModuleMetadataMocks.withTypeClazz;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getContainerModuleMetadataId(containerModuleMetadataFixture);
      });

      it('should return class type', () => {
        expect(result).toBe(containerModuleMetadataFixture.moduleType);
      });
    });
  });
});
