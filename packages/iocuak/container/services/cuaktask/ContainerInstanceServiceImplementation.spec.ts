import {
  Builder,
  DependentTask,
  DependentTaskRunner,
  TaskStatus,
} from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../task/models/domain/ServiceId';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { TaskKindType } from '../../../task/models/domain/TaskKindType';
import { ContainerRequestService } from '../domain/ContainerRequestService';
import { ContainerInstanceServiceImplementation } from './ContainerInstanceServiceImplementation';

describe(ContainerInstanceServiceImplementation.name, () => {
  let containerRequestService: jest.Mocked<ContainerRequestService>;
  let dependentTaskRunner: jest.Mocked<DependentTaskRunner>;
  let taskBuilder: jest.Mocked<
    Builder<[TaskKind], DependentTask<TaskKind, TaskKind>>
  >;

  let containerInstanceServiceImplementation: ContainerInstanceServiceImplementation;

  beforeAll(() => {
    containerRequestService = {} as Partial<
      jest.Mocked<ContainerRequestService>
    > as jest.Mocked<ContainerRequestService>;

    dependentTaskRunner = {
      run: jest.fn(),
    } as Partial<
      jest.Mocked<DependentTaskRunner>
    > as jest.Mocked<DependentTaskRunner>;

    taskBuilder = {
      build: jest.fn(),
    };

    containerInstanceServiceImplementation =
      new ContainerInstanceServiceImplementation(
        containerRequestService,
        dependentTaskRunner,
        taskBuilder,
      );
  });

  describe('when called', () => {
    let serviceIdFixture: ServiceId;
    let taskKindFixture: TaskKind;
    let dependentTaskFixture: DependentTask<TaskKind, TaskKind>;
    let instanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = 'sample-service-id';
      taskKindFixture = {
        id: serviceIdFixture,
        type: TaskKindType.createInstance,
      };
      dependentTaskFixture = {
        dependencies: [],
        kind: taskKindFixture,
        perform: jest.fn(),
        status: TaskStatus.NotStarted,
      };

      instanceFixture = { foo: 'bar' };

      taskBuilder.build.mockReturnValueOnce(dependentTaskFixture);
      dependentTaskRunner.run.mockReturnValueOnce(instanceFixture);

      result = containerInstanceServiceImplementation.create(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call taskBuilder.build()', () => {
      expect(taskBuilder.build).toHaveBeenCalledTimes(1);
      expect(taskBuilder.build).toHaveBeenCalledWith(taskKindFixture);
    });

    it('should call dependentTaskRunner.run()', () => {
      expect(dependentTaskRunner.run).toHaveBeenCalledTimes(1);
      expect(dependentTaskRunner.run).toHaveBeenCalledWith(
        dependentTaskFixture,
      );
    });

    it('should return an instance', () => {
      expect(result).toBe(instanceFixture);
    });
  });
});
