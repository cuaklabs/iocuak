jest.mock('../../../classMetadata/utils/domain/getDefaultClassMetadata');
jest.mock('../../../reflectMetadata/utils/domain/getReflectMetadata');

import { ClassMetadataFixtures } from '../../../classMetadata/fixtures/domain/ClassMetadataFixtures';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { getDefaultClassMetadata } from '../../../classMetadata/utils/domain/getDefaultClassMetadata';
import { Newable } from '../../../common/models/domain/Newable';
import { MetadataKey } from '../../../reflectMetadata/models/domain/MetadataKey';
import { getReflectMetadata } from '../../../reflectMetadata/utils/domain/getReflectMetadata';
import { MetadataServiceImplementation } from './MetadataServiceImplementation';

describe(MetadataServiceImplementation.name, () => {
  let metadataServiceImplementation: MetadataServiceImplementation;

  beforeAll(() => {
    metadataServiceImplementation = new MetadataServiceImplementation();
  });

  describe('.getBindingMetadata', () => {
    describe('when called', () => {
      let typeFixture: Newable;

      beforeAll(() => {
        typeFixture = class {};

        metadataServiceImplementation.getBindingMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getReflectMetadata()', () => {
        expect(getReflectMetadata).toHaveBeenCalledTimes(1);
        expect(getReflectMetadata).toHaveBeenCalledWith(
          typeFixture,
          MetadataKey.injectable,
        );
      });
    });
  });

  describe('.getClassMetadata()', () => {
    describe('when called, and getReflectMetadata returns undefined', () => {
      let typeFixture: Newable;
      let classMetadataFixture: ClassMetadata;

      let result: unknown;

      beforeAll(() => {
        typeFixture = class {};
        classMetadataFixture = {
          constructorArguments: [],
          properties: new Map(),
        };

        (
          getReflectMetadata as jest.Mock<ClassMetadata | undefined>
        ).mockReturnValueOnce(undefined);

        (
          getDefaultClassMetadata as jest.Mock<ClassMetadata | undefined>
        ).mockReturnValueOnce(classMetadataFixture);

        result = metadataServiceImplementation.getClassMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getReflectMetadata()', () => {
        expect(getReflectMetadata).toHaveBeenCalledTimes(1);
        expect(getReflectMetadata).toHaveBeenCalledWith(
          typeFixture,
          MetadataKey.inject,
        );
      });

      it('should call getDefaultClassMetadata', () => {
        expect(getDefaultClassMetadata).toHaveBeenCalledTimes(1);
      });

      it('should return ClassMetadata', () => {
        expect(result).toBe(classMetadataFixture);
      });
    });

    describe('when called, and getReflectMetadata returns ClassMetadata', () => {
      let typeFixture: Newable;
      let classMetadataFixture: ClassMetadata;

      let result: unknown;

      beforeAll(() => {
        typeFixture = class {};
        classMetadataFixture =
          ClassMetadataFixtures.withConstructorArgumentsAndProperties;

        (getReflectMetadata as jest.Mock<ClassMetadata>).mockReturnValueOnce(
          classMetadataFixture,
        );

        result = metadataServiceImplementation.getClassMetadata(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getReflectMetadata()', () => {
        expect(getReflectMetadata).toHaveBeenCalledTimes(1);
        expect(getReflectMetadata).toHaveBeenCalledWith(
          typeFixture,
          MetadataKey.inject,
        );
      });

      it('should return ClassMetadata', () => {
        expect(result).toStrictEqual(
          ClassMetadataFixtures.withConstructorArgumentsAndProperties,
        );
      });
    });
  });
});
