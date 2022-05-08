jest.mock('../../binding/utils/domain/lazyGetBindingOrThrow');

import { TypeBindingFixtures } from '../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../binding/fixtures/domain/ValueBindingFixtures';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../binding/models/domain/ValueBinding';
import { BindingService } from '../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../binding/utils/domain/lazyGetBindingOrThrow';
import { ClassMetadataFixtures } from '../../classMetadata/fixtures/domain/ClassMetadataFixtures';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { DirectTaskDependencyEngine } from './DirectTaskDependencyEngine';

describe(DirectTaskDependencyEngine.name, () => {
  let containerBindingService: jest.Mocked<BindingService>;
  let metadataServiceMock: jest.Mocked<MetadataService>;

  let directTaskDependencyEngine: DirectTaskDependencyEngine;

  beforeAll(() => {
    containerBindingService = {
      get: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;

    metadataServiceMock = {
      getClassMetadata: jest.fn(),
    } as Partial<jest.Mocked<MetadataService>> as jest.Mocked<MetadataService>;

    directTaskDependencyEngine = new DirectTaskDependencyEngine(
      containerBindingService,
      metadataServiceMock,
    );
  });

  describe('.getDirectDependencies()', () => {
    describe('having a CreateInstanceTaskKind', () => {
      let createInstanceTaskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        createInstanceTaskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called, and containerService.binding.get() returns undefined', () => {
        let bindingFixture: TypeBinding;
        let result: unknown;

        beforeAll(() => {
          bindingFixture = TypeBindingFixtures.any;

          containerBindingService.get.mockReturnValueOnce(undefined);

          (lazyGetBindingOrThrow as jest.Mock<TypeBinding>).mockReturnValueOnce(
            bindingFixture,
          );

          metadataServiceMock.getClassMetadata.mockReturnValueOnce(
            ClassMetadataFixtures.any,
          );

          result = directTaskDependencyEngine.getDirectDependencies(
            createInstanceTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call lazyGetBindingOrThrow()', () => {
          expect(lazyGetBindingOrThrow).toHaveBeenCalledTimes(1);
          expect(lazyGetBindingOrThrow).toHaveBeenCalledWith(
            createInstanceTaskKindFixture.id,
            metadataServiceMock,
          );
        });

        it('should return a TDependencyKind[]', () => {
          const expected: TaskKind[] = [
            {
              id: createInstanceTaskKindFixture.id,
              metadata: ClassMetadataFixtures.any,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and containerService.binding.get() returns a type binding and containerService.metadata.get() returns metadata', () => {
        let bindingFixture: TypeBinding;
        let result: unknown;

        beforeAll(() => {
          bindingFixture = TypeBindingFixtures.any;

          containerBindingService.get.mockReturnValueOnce(bindingFixture);

          metadataServiceMock.getClassMetadata.mockReturnValueOnce(
            ClassMetadataFixtures.any,
          );

          result = directTaskDependencyEngine.getDirectDependencies(
            createInstanceTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a TDependencyKind[]', () => {
          const expected: TaskKind[] = [
            {
              id: createInstanceTaskKindFixture.id,
              metadata: ClassMetadataFixtures.any,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });

      describe('when called, and containerService.binding.get() returns a value binding', () => {
        let bindingFixture: ValueBinding;
        let result: unknown;

        beforeAll(() => {
          bindingFixture = {
            ...ValueBindingFixtures.any,
            id: createInstanceTaskKindFixture.id,
          };

          containerBindingService.get.mockReturnValueOnce(bindingFixture);

          result = directTaskDependencyEngine.getDirectDependencies(
            createInstanceTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return no dependencies', () => {
          expect(result).toStrictEqual([]);
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind with no dependencies', () => {
      let getInstanceDependenciesTaskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        getInstanceDependenciesTaskKindFixture =
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsEmptyAndPropertiesEmpty;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = directTaskDependencyEngine.getDirectDependencies(
            getInstanceDependenciesTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a TDependencyKind[]', () => {
          expect(result).toStrictEqual([]);
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind with constructor arguments', () => {
      let getInstanceDependenciesTaskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        getInstanceDependenciesTaskKindFixture =
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsOneAndPropertiesEmpty;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = directTaskDependencyEngine.getDirectDependencies(
            getInstanceDependenciesTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a TDependencyKind[]', () => {
          const expected: TaskKind[] = [
            {
              id: ClassMetadataFixtures
                .withConstructorArgumentsOneAndPropertiesEmpty
                .constructorArguments[0] as ServiceId,
              requestId: getInstanceDependenciesTaskKindFixture.requestId,
              type: TaskKindType.createInstance,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind with properties', () => {
      let getInstanceDependenciesTaskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        getInstanceDependenciesTaskKindFixture =
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsEmptyAndProperties;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = directTaskDependencyEngine.getDirectDependencies(
            getInstanceDependenciesTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a TDependencyKind[]', () => {
          const expected: TaskKind[] = [
            {
              id: ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesOne.properties
                .values()
                .next().value as ServiceId,
              requestId: getInstanceDependenciesTaskKindFixture.requestId,
              type: TaskKindType.createInstance,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
