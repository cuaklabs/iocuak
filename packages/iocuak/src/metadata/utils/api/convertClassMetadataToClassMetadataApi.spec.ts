import { ClassMetadataApi } from '../../models/api/ClassMetadataApi';
import { ClassMetadata } from '../../models/domain/ClassMetadata';
import { convertClassMetadataToClassMetadataApi } from './convertClassMetadataToClassMetadataApi';

describe(convertClassMetadataToClassMetadataApi.name, () => {
  describe('when called', () => {
    let classMetadataFixture: ClassMetadata;
    let classMetadataApiFixture: ClassMetadataApi;
    let result: unknown;

    beforeAll(() => {
      classMetadataFixture = {
        constructorArguments: ['ctor-first-service-id'],
        properties: new Map([['foo', Symbol.for('bar')]]),
      };

      classMetadataApiFixture = {
        constructorArguments: ['ctor-first-service-id'],
        properties: new Map([['foo', Symbol.for('bar')]]),
      };

      result = convertClassMetadataToClassMetadataApi(classMetadataFixture);
    });

    it('should return ClassMetadataApi', () => {
      expect(result).toStrictEqual(classMetadataApiFixture);
    });
  });
});
