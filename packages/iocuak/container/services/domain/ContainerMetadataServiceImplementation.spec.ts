jest.mock('../../../metadata/utils/getReflectMetadata');

import { ClassMetadataFixtures } from '../../../metadata/fixtures/domain/ClassMetadataFixtures';
import { InjectDecoratorMetadata } from '../../../metadata/models/domain/InjectDecoratorMetadata';
import { MetadataKey } from '../../../metadata/models/domain/MetadataKey';
import { getReflectMetadata } from '../../../metadata/utils/getReflectMetadata';
import { Newable } from '../../../task/models/domain/Newable';
import { ContainerMetadataServiceImplementation } from './ContainerMetadataServiceImplementation';

describe(ContainerMetadataServiceImplementation.name, () => {
  let containerMetadataServiceImplementation: ContainerMetadataServiceImplementation;

  beforeAll(() => {
    containerMetadataServiceImplementation =
      new ContainerMetadataServiceImplementation();
  });

  describe('.get()', () => {
    describe('when called, and getReflectMetadata returns undefined', () => {
      let typeFixture: Newable;

      let result: unknown;

      beforeAll(() => {
        typeFixture = class {};

        (
          getReflectMetadata as jest.Mock<InjectDecoratorMetadata | undefined>
        ).mockReturnValueOnce(undefined);

        result = containerMetadataServiceImplementation.get(typeFixture);
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

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and getReflectMetadata returns InjectDecoratorMetadata', () => {
      let typeFixture: Newable;
      let injectDecoratorMetadataFixture: InjectDecoratorMetadata;

      let result: unknown;

      beforeAll(() => {
        typeFixture = class {};
        injectDecoratorMetadataFixture = {
          parameters:
            ClassMetadataFixtures.withConstructorArgumentsAndProperties
              .constructorArguments,
          properties:
            ClassMetadataFixtures.withConstructorArgumentsAndProperties
              .properties,
        };

        (
          getReflectMetadata as jest.Mock<InjectDecoratorMetadata>
        ).mockReturnValueOnce(injectDecoratorMetadataFixture);

        result = containerMetadataServiceImplementation.get(typeFixture);
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
