import { SetLike, TaskDependencyEngine } from '@cuaklabs/cuaktask';

jest.mock('../../utils/isTaskKind');

import { Builder } from '../../../cuaktask/common/modules/Builder';
import { Binding } from '../../binding/models/domain/Binding';
import { ContainerService } from '../../container/services/domain/ContainerService';
import { isTaskKind } from '../../utils/isTaskKind';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTask } from '../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesTask } from '../models/cuaktask/GetInstanceDependenciesTask';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskScope } from '../models/domain/TaskScope';
import { TaskBuilder } from './TaskBuilder';

describe(TaskBuilder.name, () => {
  let taskDependenciesKindSetBuilder: jest.Mocked<
    Builder<[], SetLike<TaskKind>>
  >;
  let taskDependencyEngine: jest.Mocked<TaskDependencyEngine>;
  let containerInternalService: ContainerService;

  let taskBuilder: TaskBuilder;

  beforeAll(() => {
    taskDependenciesKindSetBuilder = {
      build: jest.fn().mockImplementation(() => new Set()),
    };
    taskDependencyEngine = {
      getDependencies: jest.fn(),
    };
    containerInternalService = {
      binding: {
        get: jest.fn(),
      },
    } as Partial<ContainerService> as ContainerService;

    taskBuilder = new TaskBuilder(
      taskDependenciesKindSetBuilder,
      taskDependencyEngine,
      containerInternalService,
    );
  });

  describe('.build()', () => {
    describe('when called, with a taskKind of type TaskKindType.createInstance', () => {
      let bindingFixture: Binding;
      let result: unknown;

      beforeAll(() => {
        bindingFixture = {
          id: CreateInstanceTaskKindFixtures.any.id,
          scope: TaskScope.transient,
          type: class {},
        };

        (isTaskKind as unknown as jest.Mock).mockReturnValueOnce(true);

        (
          containerInternalService.binding.get as jest.Mock<Binding | undefined>
        ).mockReturnValueOnce(bindingFixture);

        taskDependencyEngine.getDependencies.mockReturnValueOnce([]);

        result = taskBuilder.build(CreateInstanceTaskKindFixtures.any);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call .isTaskKind()', () => {
        expect(isTaskKind).toHaveBeenCalledTimes(1);
        expect(isTaskKind).toHaveBeenCalledWith(
          CreateInstanceTaskKindFixtures.any,
        );
      });

      it('should return a CreateInstanceTask instance', () => {
        expect(result).toBeInstanceOf(CreateInstanceTask);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<CreateInstanceTask>>({
            dependencies: [],
            kind: CreateInstanceTaskKindFixtures.any,
          }),
        );
      });
    });

    describe('when called, with a taskKind of type TaskKindType.getInstanceDependencies', () => {
      let result: unknown;

      beforeAll(() => {
        (isTaskKind as unknown as jest.Mock).mockReturnValueOnce(true);

        taskDependencyEngine.getDependencies.mockReturnValueOnce([]);

        result = taskBuilder.build(GetInstanceDependenciesTaskKindFixtures.any);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call .isTaskKind()', () => {
        expect(isTaskKind).toHaveBeenCalledTimes(1);
        expect(isTaskKind).toHaveBeenCalledWith(
          GetInstanceDependenciesTaskKindFixtures.any,
        );
      });

      it('should return a GetInstanceDependenciesTask instance', () => {
        expect(result).toBeInstanceOf(GetInstanceDependenciesTask);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<GetInstanceDependenciesTask>>({
            dependencies: [],
            kind: GetInstanceDependenciesTaskKindFixtures.any,
          }),
        );
      });
    });
  });
});
