import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../foundation/calculations/hashString');

import { ServiceId } from '@cuaklabs/iocuak-common';
import {
  ClassElementMetadataApi,
  ClassElementMetadataApiType,
} from '@cuaklabs/iocuak-models-api';

import { hashString } from '../../../foundation/calculations/hashString';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { buildContainerModuleFactoryMetadataId } from './buildContainerModuleFactoryMetadataId';

describe(buildContainerModuleFactoryMetadataId.name, () => {
  describe('having metadata with no injects', () => {
    let metadataFixture: ContainerModuleFactoryMetadataApi;

    beforeAll(() => {
      metadataFixture = {
        factory: () => ({
          load: () => undefined,
        }),
      };
    });

    describe('when called', () => {
      let hashFixture: string;
      let result: unknown;

      beforeAll(() => {
        hashFixture = 'hashFixture';

        (hashString as jest.Mock<typeof hashString>).mockReturnValueOnce(
          hashFixture,
        );

        result = buildContainerModuleFactoryMetadataId(metadataFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call hashString()', () => {
        expect(hashString).toHaveBeenCalledTimes(1);
        expect(hashString).toHaveBeenCalledWith(
          `|${metadataFixture.factory.toString()}`,
        );
      });

      it('should return a string', () => {
        expect(result).toBe(hashFixture);
      });
    });
  });

  describe('having metadata with a ServiceId inject', () => {
    let injectFixture: ServiceId;
    let metadataFixture: ContainerModuleFactoryMetadataApi;

    beforeAll(() => {
      injectFixture = Symbol.for('service-id');

      metadataFixture = {
        factory: () => ({
          load: () => undefined,
        }),
        injects: [injectFixture],
      };
    });

    describe('when called', () => {
      let hashFixture: string;
      let result: unknown;

      beforeAll(() => {
        hashFixture = 'hashFixture';

        (hashString as jest.Mock<typeof hashString>).mockReturnValueOnce(
          hashFixture,
        );

        result = buildContainerModuleFactoryMetadataId(metadataFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call hashString()', () => {
        expect(hashString).toHaveBeenCalledTimes(1);
        expect(hashString).toHaveBeenCalledWith(
          `Symbol(service-id)|${metadataFixture.factory.toString()}`,
        );
      });

      it('should return a string', () => {
        expect(result).toBe(hashFixture);
      });
    });
  });

  describe('having metadata with a ClassElementMetadataApi ServiceId inject', () => {
    let injectFixture: ClassElementMetadataApi;
    let metadataFixture: ContainerModuleFactoryMetadataApi;

    beforeAll(() => {
      injectFixture = {
        type: ClassElementMetadataApiType.serviceId,
        value: Symbol.for('service-id'),
      };

      metadataFixture = {
        factory: () => ({
          load: () => undefined,
        }),
        injects: [injectFixture],
      };
    });

    describe('when called', () => {
      let hashFixture: string;
      let result: unknown;

      beforeAll(() => {
        hashFixture = 'hashFixture';

        (hashString as jest.Mock<typeof hashString>).mockReturnValueOnce(
          hashFixture,
        );

        result = buildContainerModuleFactoryMetadataId(metadataFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call hashString()', () => {
        expect(hashString).toHaveBeenCalledTimes(1);
        expect(hashString).toHaveBeenCalledWith(
          `serviceId|Symbol(service-id)|${metadataFixture.factory.toString()}`,
        );
      });

      it('should return a string', () => {
        expect(result).toBe(hashFixture);
      });
    });
  });

  describe('having metadata with a ClassElementMetadataApi Tag inject', () => {
    let injectFixture: ClassElementMetadataApi;
    let metadataFixture: ContainerModuleFactoryMetadataApi;

    beforeAll(() => {
      injectFixture = {
        type: ClassElementMetadataApiType.tag,
        value: Symbol.for('service-id'),
      };

      metadataFixture = {
        factory: () => ({
          load: () => undefined,
        }),
        injects: [injectFixture],
      };
    });

    describe('when called', () => {
      let hashFixture: string;
      let result: unknown;

      beforeAll(() => {
        hashFixture = 'hashFixture';

        (hashString as jest.Mock<typeof hashString>).mockReturnValueOnce(
          hashFixture,
        );

        result = buildContainerModuleFactoryMetadataId(metadataFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call hashString()', () => {
        expect(hashString).toHaveBeenCalledTimes(1);
        expect(hashString).toHaveBeenCalledWith(
          `tag|Symbol(service-id)|${metadataFixture.factory.toString()}`,
        );
      });

      it('should return a string', () => {
        expect(result).toBe(hashFixture);
      });
    });
  });
});
