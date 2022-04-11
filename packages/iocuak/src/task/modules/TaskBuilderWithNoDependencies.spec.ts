jest.mock('../../utils/isTaskKind');

import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { ContainerRequestService } from '../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../container/services/domain/ContainerSingletonService';
import { isTaskKind } from '../../utils/isTaskKind';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTask } from '../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesTask } from '../models/cuaktask/GetInstanceDependenciesTask';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskBuilderWithNoDependencies } from './TaskBuilderWithNoDependencies';

describe(TaskBuilderWithNoDependencies.name, () => {
  let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
  let containerRequestService: jest.Mocked<ContainerRequestService>;
  let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;

  let taskBuilderWithNoDependencies: TaskBuilderWithNoDependencies;

  beforeAll(() => {
    containerBindingServiceMock = {} as Partial<
      jest.Mocked<ContainerBindingService>
    > as jest.Mocked<ContainerBindingService>;
    containerRequestService = {} as Partial<
      jest.Mocked<ContainerRequestService>
    > as jest.Mocked<ContainerRequestService>;
    containerSingletonServiceMock = {} as Partial<
      jest.Mocked<ContainerSingletonService>
    > as jest.Mocked<ContainerSingletonService>;

    taskBuilderWithNoDependencies = new TaskBuilderWithNoDependencies(
      containerBindingServiceMock,
      containerRequestService,
      containerSingletonServiceMock,
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
        expect(result).toBeInstanceOf(GetInstanceDependenciesTask);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<GetInstanceDependenciesTask>>({
            dependencies: [],
            kind: getInstanceDependenciesTaskKindFixture,
          }),
        );
      });
    });
  });
});
