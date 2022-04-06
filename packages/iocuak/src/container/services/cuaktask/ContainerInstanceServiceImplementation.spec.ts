import {
  Builder,
  DependentTask,
  DependentTaskRunner,
  TaskStatus,
} from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { CreateInstanceTaskKindFixtures } from '../../../task/fixtures/domain/CreateInstanceTaskKindFixtures';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { ContainerRequestService } from '../domain/ContainerRequestService';
import { ContainerInstanceServiceImplementation } from './ContainerInstanceServiceImplementation';

describe(ContainerInstanceServiceImplementation.name, () => {
  let containerRequestService: jest.Mocked<ContainerRequestService>;
  let dependentTaskRunner: jest.Mocked<DependentTaskRunner>;
  let taskBuilder: jest.Mocked<
    Builder<DependentTask<TaskKind, TaskKind>, [TaskKind]>
  >;

  let containerInstanceServiceImplementation: ContainerInstanceServiceImplementation;

  beforeAll(() => {
    containerRequestService = {
      end: jest.fn(),
      start: jest.fn(),
    } as Partial<
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
    let requestIdFixture: symbol;
    let serviceIdFixture: ServiceId;
    let taskKindFixture: TaskKind;
    let dependentTaskFixture: DependentTask<TaskKind, TaskKind>;
    let instanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      taskKindFixture = CreateInstanceTaskKindFixtures.any;
      requestIdFixture = taskKindFixture.requestId;
      serviceIdFixture = taskKindFixture.id;

      dependentTaskFixture = {
        dependencies: [],
        kind: taskKindFixture,
        perform: jest.fn(),
        result: {
          get: () => {
            throw new Error();
          },
        },
        status: TaskStatus.NotStarted,
      };

      instanceFixture = { foo: 'bar' };

      containerRequestService.start.mockReturnValueOnce(requestIdFixture);
      taskBuilder.build.mockReturnValueOnce(dependentTaskFixture);
      dependentTaskRunner.run.mockReturnValueOnce(instanceFixture);

      result = containerInstanceServiceImplementation.create(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call containerRequestService.start()', () => {
      expect(containerRequestService.start).toHaveBeenCalledTimes(1);
      expect(containerRequestService.start).toHaveBeenCalledWith();
    });

    it('should call taskBuilder.build()', () => {
      expect(taskBuilder.build).toHaveBeenCalledTimes(1);
      expect(taskBuilder.build).toHaveBeenCalledWith(taskKindFixture);
    });

    it('should call containerRequestService.end()', () => {
      expect(containerRequestService.end).toHaveBeenCalledTimes(1);
      expect(containerRequestService.end).toHaveBeenCalledWith(
        requestIdFixture,
      );
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
