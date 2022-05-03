jest.mock('../utils/isTaskKind');

import { BindingService } from '../../binding/services/domain/BindingService';
import { ContainerRequestService } from '../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../container/services/domain/ContainerSingletonService';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTask } from '../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesTask } from '../models/cuaktask/GetInstanceDependenciesTask';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { isTaskKind } from '../utils/isTaskKind';
import { TaskBuilderWithNoDependencies } from './TaskBuilderWithNoDependencies';

describe(TaskBuilderWithNoDependencies.name, () => {
  let containerBindingServiceFixture: BindingService;
  let containerRequestServiceFixture: ContainerRequestService;
  let containerSingletonServiceFixture: ContainerSingletonService;
  let metadataServiceFixture: MetadataService;

  let taskBuilderWithNoDependencies: TaskBuilderWithNoDependencies;

  beforeAll(() => {
    containerBindingServiceFixture = {
      _tag: Symbol('ContainerBindingService'),
    } as Partial<BindingService> as BindingService;
    containerRequestServiceFixture = {
      _tag: Symbol('ContainerRequestService'),
    } as Partial<ContainerRequestService> as ContainerRequestService;
    containerSingletonServiceFixture = {
      _tag: Symbol('ContainerSingletonService'),
    } as Partial<ContainerSingletonService> as ContainerSingletonService;
    metadataServiceFixture = {
      _tag: Symbol('MetadataService'),
    } as Partial<MetadataService> as MetadataService;

    taskBuilderWithNoDependencies = new TaskBuilderWithNoDependencies(
      containerBindingServiceFixture,
      containerRequestServiceFixture,
      containerSingletonServiceFixture,
      metadataServiceFixture,
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
