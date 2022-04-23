import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { ContainerInstanceService } from '../../container/services/domain/ContainerInstanceService';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { ContainerModuleCreateInstancesTaskKindMocks } from '../mocks/models/domain/ContainerModuleCreateInstancesTaskKindMocks';
import { ContainerModuleLoadFromMetadataTaskKindMocks } from '../mocks/models/domain/ContainerModuleLoadFromMetadataTaskKindMocks';
import { ContainerModuleCreateInstancesTask } from '../models/cuaktast/ContainerModuleCreateInstancesTask';
import { ContainerModuleLoadFromMetadataTask } from '../models/cuaktast/ContainerModuleLoadFromMetadataTask';
import { ContainerModuleCreateInstancesTaskKind } from '../models/domain/ContainerModuleCreateInstancesTaskKind';
import { ContainerModuleLoadFromMetadataTaskKind } from '../models/domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleTaskBuilderWithNoDependencies } from './ContainerModuleTaskBuilderWithNoDependencies';

describe(ContainerModuleTaskBuilderWithNoDependencies.name, () => {
  let containerBindingServiceFixture: ContainerBindingService;
  let containerInstanceServiceFixture: ContainerInstanceService;
  let metadataServiceFixture: MetadataService;

  let containerModuleTaskBuilderWithNoDependencies: ContainerModuleTaskBuilderWithNoDependencies;

  beforeAll(() => {
    containerBindingServiceFixture = {
      _tag: Symbol('ContainerBindingService'),
    } as unknown as ContainerBindingService;
    containerInstanceServiceFixture = {
      _tag: Symbol('ContainerInstanceService'),
    } as unknown as ContainerInstanceService;
    metadataServiceFixture = {
      _tag: Symbol('MetadataService'),
    } as unknown as MetadataService;

    containerModuleTaskBuilderWithNoDependencies =
      new ContainerModuleTaskBuilderWithNoDependencies(
        containerBindingServiceFixture,
        containerInstanceServiceFixture,
        metadataServiceFixture,
      );
  });

  describe('having a task kind of type createInstances', () => {
    let taskKindFixture: ContainerModuleCreateInstancesTaskKind;

    beforeAll(() => {
      taskKindFixture = ContainerModuleCreateInstancesTaskKindMocks.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          containerModuleTaskBuilderWithNoDependencies.buildWithNoDependencies(
            taskKindFixture,
          );
      });

      it('should return a ContainerModuleCreateInstancesTask', () => {
        const expected: ContainerModuleCreateInstancesTask =
          new ContainerModuleCreateInstancesTask(
            taskKindFixture,
            [],
            containerInstanceServiceFixture,
          );

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a task kind of type loadMetadata', () => {
    let taskKindFixture: ContainerModuleLoadFromMetadataTaskKind;

    beforeAll(() => {
      taskKindFixture = ContainerModuleLoadFromMetadataTaskKindMocks.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          containerModuleTaskBuilderWithNoDependencies.buildWithNoDependencies(
            taskKindFixture,
          );
      });

      it('should return a ContainerModuleLoadFromMetadataTask', () => {
        const expected: ContainerModuleLoadFromMetadataTask =
          new ContainerModuleLoadFromMetadataTask(
            taskKindFixture,
            [],
            containerBindingServiceFixture,
            containerInstanceServiceFixture,
            metadataServiceFixture,
          );

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having an unknown task kind', () => {
    let taskKindFixture: unknown;

    beforeAll(() => {
      taskKindFixture = {};
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        try {
          containerModuleTaskBuilderWithNoDependencies.buildWithNoDependencies(
            taskKindFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: 'Task kind not supported!',
          }),
        );
      });
    });
  });
});
