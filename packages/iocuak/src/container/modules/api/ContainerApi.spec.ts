jest.mock('@cuaklabs/cuaktask');

import * as cuaktask from '@cuaklabs/cuaktask';

jest.mock('../../../containerModuleTask/modules/ContainerModuleTaskBuilder');
jest.mock(
  '../../../containerModuleTask/modules/ContainerModuleTaskBuilderWithNoDependencies',
);
jest.mock(
  '../../../containerModuleTask/modules/ContainerModuleTaskDependencyEngine',
);
jest.mock('../../../metadata/services/domain/MetadataServiceImplementation');
jest.mock('../../../task/modules/DirectTaskDependencyEngine');
jest.mock('../../../task/modules/TaskBuilder');
jest.mock('../../../task/modules/TaskBuilderWithNoDependencies');
jest.mock('../../../task/modules/TaskDependencyEngine');
jest.mock('../../services/cuaktask/ContainerInstanceServiceImplementation');
jest.mock('../../services/cuaktask/ContainerModuleServiceImplementation');
jest.mock('../../services/domain/ContainerBindingServiceImplementation');
jest.mock('../../services/domain/ContainerRequestServiceImplementation');
jest.mock('../../services/domain/ContainerSingletonServiceImplementation');

import { Newable } from '../../../common/models/domain/Newable';
import { SetLike } from '../../../common/modules/domain/SetLike';
import { ContainerModuleTaskBuilder } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilder';
import { ContainerModuleTaskBuilderWithNoDependencies } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilderWithNoDependencies';
import { ContainerModuleTaskDependencyEngine } from '../../../containerModuleTask/modules/ContainerModuleTaskDependencyEngine';
import { MetadataServiceImplementation } from '../../../metadata/services/domain/MetadataServiceImplementation';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { DirectTaskDependencyEngine } from '../../../task/modules/DirectTaskDependencyEngine';
import { TaskBuilder } from '../../../task/modules/TaskBuilder';
import { TaskBuilderWithNoDependencies } from '../../../task/modules/TaskBuilderWithNoDependencies';
import { TaskDependencyEngine } from '../../../task/modules/TaskDependencyEngine';
import { ContainerInstanceServiceImplementation } from '../../services/cuaktask/ContainerInstanceServiceImplementation';
import { ContainerModuleServiceImplementation } from '../../services/cuaktask/ContainerModuleServiceImplementation';
import { ContainerBindingServiceImplementation } from '../../services/domain/ContainerBindingServiceImplementation';
import { ContainerRequestServiceImplementation } from '../../services/domain/ContainerRequestServiceImplementation';
import { ContainerSingletonServiceImplementation } from '../../services/domain/ContainerSingletonServiceImplementation';
import { ContainerApi } from './ContainerApi';

let currentLabel: number = 0;

function buildEmptyFixture<T>(): T {
  return {
    _label: currentLabel++,
  } as unknown as T;
}

function bindFixtureToConstructor<T>(
  constructor: Newable<T>,
  fixture: T,
): void {
  (constructor as jest.Mock<T>).mockReturnValue(fixture);
}

describe(ContainerApi.name, () => {
  describe('.build', () => {
    describe('when called', () => {
      let containerBindingServiceImplementationFixture: ContainerBindingServiceImplementation;
      let metadataServiceImplementationFixture: MetadataServiceImplementation;
      let containerRequestServiceImplementationFixture: ContainerRequestServiceImplementation;
      let containerSingletonServiceImplementationFixture: ContainerSingletonServiceImplementation;

      let dependentTaskRunnerFixture: cuaktask.DependentTaskRunner;

      let directTaskDependencyEngineFixture: DirectTaskDependencyEngine;
      let taskDependencyEngineFixture: TaskDependencyEngine;
      let taskBuilderWithNoDependenciesFixture: TaskBuilderWithNoDependencies;
      let taskBuilderFixture: TaskBuilder;

      let containerInstanceServiceImplementationFixture: ContainerInstanceServiceImplementation;

      let containerModuleTaskDependencyEngineFixture: ContainerModuleTaskDependencyEngine;
      let containerModuleTaskBuilderWithNoDependenciesFixture: ContainerModuleTaskBuilderWithNoDependencies;
      let containerModuleTaskBuilderFixture: ContainerModuleTaskBuilder;

      let containerModuleServiceImplementationFixture: ContainerModuleServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerBindingServiceImplementation,
          containerBindingServiceImplementationFixture,
        );

        metadataServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          MetadataServiceImplementation,
          metadataServiceImplementationFixture,
        );

        containerRequestServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerRequestServiceImplementation,
          containerRequestServiceImplementationFixture,
        );

        containerSingletonServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerSingletonServiceImplementation,
          containerSingletonServiceImplementationFixture,
        );

        dependentTaskRunnerFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          cuaktask.DependentTaskRunner,
          dependentTaskRunnerFixture,
        );

        directTaskDependencyEngineFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          DirectTaskDependencyEngine,
          directTaskDependencyEngineFixture,
        );

        taskDependencyEngineFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          TaskDependencyEngine,
          taskDependencyEngineFixture,
        );

        taskBuilderWithNoDependenciesFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          TaskBuilderWithNoDependencies,
          taskBuilderWithNoDependenciesFixture,
        );

        taskBuilderFixture = buildEmptyFixture();
        bindFixtureToConstructor(TaskBuilder, taskBuilderFixture);

        containerInstanceServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerInstanceServiceImplementation,
          containerInstanceServiceImplementationFixture,
        );

        containerModuleTaskDependencyEngineFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerModuleTaskDependencyEngine,
          containerModuleTaskDependencyEngineFixture,
        );

        containerModuleTaskBuilderWithNoDependenciesFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerModuleTaskBuilderWithNoDependencies,
          containerModuleTaskBuilderWithNoDependenciesFixture,
        );

        containerModuleTaskBuilderFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerModuleTaskBuilder,
          containerModuleTaskBuilderFixture,
        );

        containerModuleServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerModuleServiceImplementation,
          containerModuleServiceImplementationFixture,
        );

        result = ContainerApi.build();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call new ContainerBindingServiceImplementation()', () => {
        expect(ContainerBindingServiceImplementation).toHaveBeenCalledTimes(1);
        expect(ContainerBindingServiceImplementation).toHaveBeenCalledWith(
          undefined,
        );
      });

      it('should call new MetadataServiceImplementation()', () => {
        expect(MetadataServiceImplementation).toHaveBeenCalledTimes(1);
        expect(MetadataServiceImplementation).toHaveBeenCalledWith();
      });

      it('should call new ContainerRequestServiceImplementation()', () => {
        expect(ContainerRequestServiceImplementation).toHaveBeenCalledTimes(1);
        expect(ContainerRequestServiceImplementation).toHaveBeenCalledWith();
      });

      it('should call new ContainerSingletonServiceImplementation()', () => {
        expect(ContainerSingletonServiceImplementation).toHaveBeenCalledTimes(
          1,
        );
        expect(ContainerSingletonServiceImplementation).toHaveBeenCalledWith();
      });

      it('should call new cuaktask.DependentTaskRunner()', () => {
        expect(cuaktask.DependentTaskRunner).toHaveBeenCalledTimes(2);
        expect(cuaktask.DependentTaskRunner).toHaveBeenNthCalledWith(1);
        expect(cuaktask.DependentTaskRunner).toHaveBeenNthCalledWith(2);
      });

      it('should call new DirectTaskDependencyEngine()', () => {
        expect(DirectTaskDependencyEngine).toHaveBeenCalledTimes(1);
        expect(DirectTaskDependencyEngine).toHaveBeenCalledWith(
          containerBindingServiceImplementationFixture,
          metadataServiceImplementationFixture,
        );
      });

      it('should call new TaskDependencyEngine()', () => {
        expect(TaskDependencyEngine).toHaveBeenCalledTimes(1);
        expect(TaskDependencyEngine).toHaveBeenCalledWith(
          directTaskDependencyEngineFixture,
          {
            build: expect.any(Function) as () => SetLike<TaskKind>,
          },
        );
      });

      it('should call new TaskBuilderWithNoDependencies()', () => {
        expect(TaskBuilderWithNoDependencies).toHaveBeenCalledTimes(1);
        expect(TaskBuilderWithNoDependencies).toHaveBeenCalledWith(
          containerBindingServiceImplementationFixture,
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
        );
      });

      it('should call new TaskBuilder()', () => {
        expect(TaskBuilder).toHaveBeenCalledTimes(1);
        expect(TaskBuilder).toHaveBeenCalledWith(
          taskDependencyEngineFixture,
          taskBuilderWithNoDependenciesFixture,
        );
      });

      it('should call new ContainerInstanceServiceImplementation()', () => {
        expect(ContainerInstanceServiceImplementation).toHaveBeenCalledTimes(1);
        expect(ContainerInstanceServiceImplementation).toHaveBeenCalledWith(
          containerRequestServiceImplementationFixture,
          dependentTaskRunnerFixture,
          taskBuilderFixture,
        );
      });

      it('should call new ContainerModuleTaskDependencyEngine()', () => {
        expect(ContainerModuleTaskDependencyEngine).toHaveBeenCalledTimes(1);
        expect(ContainerModuleTaskDependencyEngine).toHaveBeenCalledWith();
      });

      it('should call new ContainerModuleTaskBuilderWithNoDependencies()', () => {
        expect(
          ContainerModuleTaskBuilderWithNoDependencies,
        ).toHaveBeenCalledTimes(1);
        expect(
          ContainerModuleTaskBuilderWithNoDependencies,
        ).toHaveBeenCalledWith(
          containerBindingServiceImplementationFixture,
          containerInstanceServiceImplementationFixture,
          metadataServiceImplementationFixture,
        );
      });

      it('should call new ContainerModuleTaskBuilder()', () => {
        expect(ContainerModuleTaskBuilder).toHaveBeenCalledTimes(1);
        expect(ContainerModuleTaskBuilder).toHaveBeenCalledWith(
          containerModuleTaskDependencyEngineFixture,
          containerModuleTaskBuilderWithNoDependenciesFixture,
        );
      });

      it('should call new ContainerModuleServiceImplementation()', () => {
        expect(ContainerModuleServiceImplementation).toHaveBeenCalledTimes(1);
        expect(ContainerModuleServiceImplementation).toHaveBeenCalledWith(
          containerModuleTaskBuilderFixture,
          dependentTaskRunnerFixture,
        );
      });

      it('should return a ContainerApi', () => {
        expect(result).toBeInstanceOf(ContainerApi);
      });
    });
  });
});
