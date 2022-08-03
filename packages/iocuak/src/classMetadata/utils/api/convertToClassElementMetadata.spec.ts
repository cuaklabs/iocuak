import { beforeAll, describe, expect, it } from '@jest/globals';

import {
  ClassElementMetadataType,
  ClassElementServiceIdMetadata,
  ClassElementTagMetadata,
} from '@cuaklabs/iocuak-models';
import {
  ClassElementServiceIdMetadataApi,
  ClassElementTagMetadataApi,
} from '@cuaklabs/iocuak-models-api';

import { ClassElementMetadataApiFixtures } from '../../fixtures/api/ClassElementMetadataApiFixtures';
import { convertToClassElementMetadata } from './convertToClassElementMetadata';

describe(convertToClassElementMetadata.name, () => {
  describe('having a of type serviceId', () => {
    let classElementMetadataApiFixture: ClassElementServiceIdMetadataApi;

    beforeAll(() => {
      classElementMetadataApiFixture =
        ClassElementMetadataApiFixtures.withTypeServiceId;
    });

    describe('when called', () => {
      let expectedClassElementMetadata: ClassElementServiceIdMetadata;

      let result: unknown;

      beforeAll(() => {
        expectedClassElementMetadata = {
          type: ClassElementMetadataType.serviceId,
          value: classElementMetadataApiFixture.value,
        };

        result = convertToClassElementMetadata(classElementMetadataApiFixture);
      });

      it('should return a ClassElementMetadata', () => {
        expect(result).toStrictEqual(expectedClassElementMetadata);
      });
    });
  });

  describe('having a of type tag', () => {
    let classElementMetadataApiFixture: ClassElementTagMetadataApi;

    beforeAll(() => {
      classElementMetadataApiFixture =
        ClassElementMetadataApiFixtures.withTypeTag;
    });

    describe('when called', () => {
      let expectedClassElementMetadata: ClassElementTagMetadata;

      let result: unknown;

      beforeAll(() => {
        expectedClassElementMetadata = {
          type: ClassElementMetadataType.tag,
          value: classElementMetadataApiFixture.value,
        };

        result = convertToClassElementMetadata(classElementMetadataApiFixture);
      });

      it('should return a ClassElementMetadata', () => {
        expect(result).toStrictEqual(expectedClassElementMetadata);
      });
    });
  });
});
