jest.mock('@cuaklabs/cuaktask');

import * as cuaktask from '@cuaklabs/cuaktask';

jest.mock('../../../metadata/services/domain/MetadataServiceImplementation');
jest.mock('../../../task/modules/DirectTaskDependencyEngine');
jest.mock('../../../task/modules/TaskBuilder');
jest.mock('../../../task/modules/TaskBuilderWithNoDependencies');
jest.mock('../../../task/modules/TaskDependencyEngine');
jest.mock('../../services/cuaktask/ContainerInstanceServiceImplementation');
jest.mock('../../services/domain/ContainerBindingServiceImplementation');
jest.mock('../../services/domain/ContainerRequestServiceImplementation');
jest.mock('../../services/domain/ContainerSingletonServiceImplementation');

import { Newable } from '../../../common/models/domain/Newable';
import { SetLike } from '../../../common/modules/domain/SetLike';
import { MetadataServiceImplementation } from '../../../metadata/services/domain/MetadataServiceImplementation';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { DirectTaskDependencyEngine } from '../../../task/modules/DirectTaskDependencyEngine';
import { TaskBuilder } from '../../../task/modules/TaskBuilder';
import { TaskBuilderWithNoDependencies } from '../../../task/modules/TaskBuilderWithNoDependencies';
import { TaskDependencyEngine } from '../../../task/modules/TaskDependencyEngine';
import { ContainerInstanceServiceImplementation } from '../../services/cuaktask/ContainerInstanceServiceImplementation';
import { ContainerBindingServiceImplementation } from '../../services/domain/ContainerBindingServiceImplementation';
import { ContainerRequestServiceImplementation } from '../../services/domain/ContainerRequestServiceImplementation';
import { ContainerSingletonServiceImplementation } from '../../services/domain/ContainerSingletonServiceImplementation';
import { ContainerApi } from './ContainerApi';

let currentLabel: number = 0;

function buildEmptyMock<T>(): jest.Mocked<T> {
  return {
    _label: currentLabel++,
  } as unknown as jest.Mocked<T>;
}

function bindMockToConstructor<T>(
  constructor: Newable<T>,
  mock: jest.Mocked<T>,
): void {
  (constructor as jest.Mock<T>).mockReturnValue(mock);
}

describe(ContainerApi.name, () => {
  describe('.build', () => {
    describe('when called', () => {
      let containerBindingServiceImplementationMock: jest.Mocked<ContainerBindingServiceImplementation>;
      let metadataServiceImplementationMock: jest.Mocked<MetadataServiceImplementation>;
      let containerRequestServiceImplementationMock: jest.Mocked<ContainerRequestServiceImplementation>;
      let containerSingletonServiceImplementationMock: jest.Mocked<ContainerSingletonServiceImplementation>;

      let dependentTaskRunnerMock: jest.Mocked<cuaktask.DependentTaskRunner>;

      let directTaskDependencyEngineMock: jest.Mocked<DirectTaskDependencyEngine>;
      let taskDependencyEngineMock: jest.Mocked<TaskDependencyEngine>;
      let taskBuilderWithNoDependenciesMock: jest.Mocked<TaskBuilderWithNoDependencies>;
      let taskBuilderMock: jest.Mocked<TaskBuilder>;

      let containerInstanceServiceImplementationMock: jest.Mocked<ContainerInstanceServiceImplementation>;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementationMock = buildEmptyMock();
        bindMockToConstructor(
          ContainerBindingServiceImplementation,
          containerBindingServiceImplementationMock,
        );

        metadataServiceImplementationMock = buildEmptyMock();
        bindMockToConstructor(
          MetadataServiceImplementation,
          metadataServiceImplementationMock,
        );

        containerRequestServiceImplementationMock = buildEmptyMock();
        bindMockToConstructor(
          ContainerRequestServiceImplementation,
          containerRequestServiceImplementationMock,
        );

        containerSingletonServiceImplementationMock = buildEmptyMock();
        bindMockToConstructor(
          ContainerSingletonServiceImplementation,
          containerSingletonServiceImplementationMock,
        );

        dependentTaskRunnerMock = buildEmptyMock();
        bindMockToConstructor(
          cuaktask.DependentTaskRunner,
          dependentTaskRunnerMock,
        );

        directTaskDependencyEngineMock = buildEmptyMock();
        bindMockToConstructor(
          DirectTaskDependencyEngine,
          directTaskDependencyEngineMock,
        );

        taskDependencyEngineMock = buildEmptyMock();
        bindMockToConstructor(TaskDependencyEngine, taskDependencyEngineMock);

        taskBuilderWithNoDependenciesMock = buildEmptyMock();
        bindMockToConstructor(
          TaskBuilderWithNoDependencies,
          taskBuilderWithNoDependenciesMock,
        );

        taskBuilderMock = buildEmptyMock();
        bindMockToConstructor(TaskBuilder, taskBuilderMock);

        containerInstanceServiceImplementationMock = buildEmptyMock();
        bindMockToConstructor(
          ContainerInstanceServiceImplementation,
          containerInstanceServiceImplementationMock,
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
        expect(cuaktask.DependentTaskRunner).toHaveBeenCalledTimes(1);
        expect(cuaktask.DependentTaskRunner).toHaveBeenCalledWith();
      });

      it('should call new DirectTaskDependencyEngine()', () => {
        expect(DirectTaskDependencyEngine).toHaveBeenCalledTimes(1);
        expect(DirectTaskDependencyEngine).toHaveBeenCalledWith(
          containerBindingServiceImplementationMock,
          metadataServiceImplementationMock,
        );
      });

      it('should call new TaskDependencyEngine()', () => {
        expect(TaskDependencyEngine).toHaveBeenCalledTimes(1);
        expect(TaskDependencyEngine).toHaveBeenCalledWith(
          directTaskDependencyEngineMock,
          {
            build: expect.any(Function) as () => SetLike<TaskKind>,
          },
        );
      });

      it('should call new TaskBuilderWithNoDependencies()', () => {
        expect(TaskBuilderWithNoDependencies).toHaveBeenCalledTimes(1);
        expect(TaskBuilderWithNoDependencies).toHaveBeenCalledWith(
          containerBindingServiceImplementationMock,
          containerRequestServiceImplementationMock,
          containerSingletonServiceImplementationMock,
        );
      });

      it('should call new TaskBuilder()', () => {
        expect(TaskBuilder).toHaveBeenCalledTimes(1);
        expect(TaskBuilder).toHaveBeenCalledWith(
          taskDependencyEngineMock,
          taskBuilderWithNoDependenciesMock,
        );
      });

      it('should call new ContainerInstanceServiceImplementation()', () => {
        expect(ContainerInstanceServiceImplementation).toHaveBeenCalledTimes(1);
        expect(ContainerInstanceServiceImplementation).toHaveBeenCalledWith(
          containerRequestServiceImplementationMock,
          dependentTaskRunnerMock,
          taskBuilderMock,
        );
      });

      it('should return a ContainerApi', () => {
        expect(result).toBeInstanceOf(ContainerApi);
      });
    });
  });
});
