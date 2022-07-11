import { beforeAll, describe, expect, it } from '@jest/globals';

import { ClassElementMetadataApiType } from '../../models/api/ClassElementMetadatApiType';
import { ClassMetadataApi } from '../../models/api/ClassMetadataApi';
import { ClassElementMetadataType } from '../../models/domain/ClassElementMetadataType';
import { ClassMetadata } from '../../models/domain/ClassMetadata';
import { convertToClassMetadataApi } from './convertToClassMetadataApi';

describe(convertToClassMetadataApi.name, () => {
  describe('when called', () => {
    let classMetadataFixture: ClassMetadata;
    let classMetadataApiFixture: ClassMetadataApi;
    let result: unknown;

    beforeAll(() => {
      classMetadataFixture = {
        constructorArguments: [
          {
            type: ClassElementMetadataType.serviceId,
            value: 'ctor-first-service-id',
          },
        ],
        properties: new Map([
          [
            'foo',
            {
              type: ClassElementMetadataType.serviceId,
              value: Symbol.for('bar'),
            },
          ],
        ]),
      };

      classMetadataApiFixture = {
        constructorArguments: [
          {
            type: ClassElementMetadataApiType.serviceId,
            value: 'ctor-first-service-id',
          },
        ],
        properties: new Map([
          [
            'foo',
            {
              type: ClassElementMetadataApiType.serviceId,
              value: Symbol.for('bar'),
            },
          ],
        ]),
      };

      result = convertToClassMetadataApi(classMetadataFixture);
    });

    it('should return ClassMetadataApi', () => {
      expect(result).toStrictEqual(classMetadataApiFixture);
    });
  });
});
