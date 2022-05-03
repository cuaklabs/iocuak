import { ClassMetadataApi } from '../../models/api/ClassMetadataApi';
import { ClassMetadata } from '../../models/domain/ClassMetadata';
import { convertToClassMetadataApi } from './convertToClassMetadataApi';

describe(convertToClassMetadataApi.name, () => {
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

      result = convertToClassMetadataApi(classMetadataFixture);
    });

    it('should return ClassMetadataApi', () => {
      expect(result).toStrictEqual(classMetadataApiFixture);
    });
  });
});
