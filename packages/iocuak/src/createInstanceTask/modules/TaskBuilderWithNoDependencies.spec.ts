jest.mock('../utils/isTaskKind');

import { ContainerRequestService } from '../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../container/services/domain/ContainerSingletonService';
import { CreateInstanceRootTaskKindFixtures } from '../fixtures/domain/CreateInstanceRootTaskKindFixtures';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTask } from '../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesDependentTask } from '../models/cuaktask/GetInstanceDependenciesDependentTask';
import { CreateInstanceRootTaskKind } from '../models/domain/CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { isTaskKind } from '../utils/isTaskKind';
import { TaskBuilderWithNoDependencies } from './TaskBuilderWithNoDependencies';

describe(TaskBuilderWithNoDependencies.name, () => {
  let containerRequestServiceFixture: ContainerRequestService;
  let containerSingletonServiceFixture: ContainerSingletonService;

  let taskBuilderWithNoDependencies: TaskBuilderWithNoDependencies;

  beforeAll(() => {
    containerRequestServiceFixture = {
      _tag: Symbol('ContainerRequestService'),
    } as Partial<ContainerRequestService> as ContainerRequestService;
    containerSingletonServiceFixture = {
      _tag: Symbol('ContainerSingletonService'),
    } as Partial<ContainerSingletonService> as ContainerSingletonService;

    taskBuilderWithNoDependencies = new TaskBuilderWithNoDependencies(
      containerRequestServiceFixture,
      containerSingletonServiceFixture,
    );
  });

  describe('.buildWithNoDependencies()', () => {
    describe('when called, with a taskKind of type TaskKindType.createInstance', () => {
      let createInstanceTaskKindFixture: CreateInstanceTaskKind;
      let result: unknown;

      beforeAll(() => {
        createInstanceTaskKindFixture = CreateInstanceTaskKindFixtures.any;

        (isTaskKind as unknown as jest.Mock).mockReturnValueOnce(true);

        result = taskBuilderWithNoDependencies.buildWithNoDependencies(
          createInstanceTaskKindFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call .isTaskKind()', () => {
        expect(isTaskKind).toHaveBeenCalledTimes(1);
        expect(isTaskKind).toHaveBeenCalledWith(createInstanceTaskKindFixture);
      });

      it('should return a CreateInstanceTask instance', () => {
        expect(result).toBeInstanceOf(CreateInstanceTask);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<CreateInstanceTask>>({
            dependencies: [],
            kind: createInstanceTaskKindFixture,
          }),
        );
      });
    });

    describe('when called, with a taskKind of type TaskKindType.createInstanceRoot', () => {
      let createInstanceTaskKindFixture: CreateInstanceRootTaskKind;
      let result: unknown;

      beforeAll(() => {
        createInstanceTaskKindFixture = CreateInstanceRootTaskKindFixtures.any;

        (isTaskKind as unknown as jest.Mock).mockReturnValueOnce(true);

        try {
          taskBuilderWithNoDependencies.buildWithNoDependencies(
            createInstanceTaskKindFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call .isTaskKind()', () => {
        expect(isTaskKind).toHaveBeenCalledTimes(1);
        expect(isTaskKind).toHaveBeenCalledWith(createInstanceTaskKindFixture);
      });

      it('should throw an error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: 'Invalid task kind',
          }),
        );
      });
    });

    describe('when called, with a taskKind of type TaskKindType.getInstanceDependencies', () => {
      let getInstanceDependenciesTaskKindFixture: GetInstanceDependenciesTaskKind;
      let result: unknown;

      beforeAll(() => {
        getInstanceDependenciesTaskKindFixture =
          GetInstanceDependenciesTaskKindFixtures.any;

        (isTaskKind as unknown as jest.Mock).mockReturnValueOnce(true);

        result = taskBuilderWithNoDependencies.buildWithNoDependencies(
          getInstanceDependenciesTaskKindFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call .isTaskKind()', () => {
        expect(isTaskKind).toHaveBeenCalledTimes(1);
        expect(isTaskKind).toHaveBeenCalledWith(
          getInstanceDependenciesTaskKindFixture,
        );
      });

      it('should return a GetInstanceDependenciesTask instance', () => {
        expect(result).toBeInstanceOf(GetInstanceDependenciesDependentTask);
        expect(result).toStrictEqual(
          expect.objectContaining<
            Partial<GetInstanceDependenciesDependentTask>
          >({
            dependencies: [],
            kind: getInstanceDependenciesTaskKindFixture,
          }),
        );
      });
    });
  });
});
