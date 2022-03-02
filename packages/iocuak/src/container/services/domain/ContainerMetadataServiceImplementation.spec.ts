jest.mock('../../../metadata/decorators/getDefaultClassMetadata');
jest.mock('../../../metadata/utils/getReflectMetadata');

import { Newable } from '../../../common/models/domain/Newable';
import { getDefaultClassMetadata } from '../../../metadata/decorators/getDefaultClassMetadata';
import { ClassMetadataFixtures } from '../../../metadata/fixtures/domain/ClassMetadataFixtures';
import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { MetadataKey } from '../../../metadata/models/domain/MetadataKey';
import { getReflectMetadata } from '../../../metadata/utils/getReflectMetadata';
import { ContainerMetadataServiceImplementation } from './ContainerMetadataServiceImplementation';

describe(ContainerMetadataServiceImplementation.name, () => {
  let containerMetadataServiceImplementation: ContainerMetadataServiceImplementation;

  beforeAll(() => {
    containerMetadataServiceImplementation =
      new ContainerMetadataServiceImplementation();
  });

  describe('.getBindingMetadata', () => {
    describe('when called', () => {
      let typeFixture: Newable;

      beforeAll(() => {
        typeFixture = class {};

        containerMetadataServiceImplementation.getBindingMetadata(typeFixture);
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

        result =
          containerMetadataServiceImplementation.getClassMetadata(typeFixture);
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

        result =
          containerMetadataServiceImplementation.getClassMetadata(typeFixture);
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
