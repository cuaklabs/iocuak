jest.mock('@cuaklabs/cuaktask');

import * as cuaktask from '@cuaklabs/cuaktask';

jest.mock('../../../binding/services/domain/BindingServiceImplementation');
jest.mock('../../../containerModuleTask/modules/ContainerModuleTaskBuilder');
jest.mock(
  '../../../containerModuleTask/modules/ContainerModuleTaskBuilderWithNoDependencies',
);
jest.mock(
  '../../../containerModuleTask/modules/ContainerModuleTaskDependencyEngine',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateInstanceTaskNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateRequestScopedInstanceTaskNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateSingletonScopedInstanceTaskNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateTransientScopedInstanceTaskNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskGraphEngine',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskNodeExpandCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateTagInstancesTaskNodeExpandCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/GetInstanceDependenciesTaskNodeExpandCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/TaskNodeExpandCommandHandler',
);
jest.mock('../../../metadata/services/domain/MetadataServiceImplementation');
jest.mock('../../services/cuaktask/ContainerInstanceServiceImplementation');
jest.mock('../../services/cuaktask/ContainerModuleServiceImplementation');
jest.mock('../../services/domain/ContainerRequestServiceImplementation');
jest.mock('../../services/domain/ContainerSingletonServiceImplementation');

import { BindingServiceImplementation } from '../../../binding/services/domain/BindingServiceImplementation';
import { Newable } from '../../../common/models/domain/Newable';
import { ContainerModuleTaskBuilder } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilder';
import { ContainerModuleTaskBuilderWithNoDependencies } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilderWithNoDependencies';
import { ContainerModuleTaskDependencyEngine } from '../../../containerModuleTask/modules/ContainerModuleTaskDependencyEngine';
import { CreateCreateInstanceTaskNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateInstanceTaskNodeCommandHandler';
import { CreateCreateRequestScopedInstanceTaskNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateRequestScopedInstanceTaskNodeCommandHandler';
import { CreateCreateSingletonScopedInstanceTaskNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateSingletonScopedInstanceTaskNodeCommandHandler';
import { CreateCreateTransientScopedInstanceTaskNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateTransientScopedInstanceTaskNodeCommandHandler';
import { CreateCreateTypeBindingInstanceTaskNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommandHandler';
import { CreateInstanceTaskGraphEngine } from '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskGraphEngine';
import { CreateInstanceTaskNodeExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskNodeExpandCommandHandler';
import { CreateTagInstancesTaskNodeExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateTagInstancesTaskNodeExpandCommandHandler';
import { GetInstanceDependenciesTaskNodeExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/GetInstanceDependenciesTaskNodeExpandCommandHandler';
import { TaskNodeExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/TaskNodeExpandCommandHandler';
import { MetadataServiceImplementation } from '../../../metadata/services/domain/MetadataServiceImplementation';
import { ContainerInstanceServiceImplementation } from '../../services/cuaktask/ContainerInstanceServiceImplementation';
import { ContainerModuleServiceImplementation } from '../../services/cuaktask/ContainerModuleServiceImplementation';
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
      let containerBindingServiceImplementationFixture: BindingServiceImplementation;
      let metadataServiceImplementationFixture: MetadataServiceImplementation;
      let containerRequestServiceImplementationFixture: ContainerRequestServiceImplementation;
      let containerSingletonServiceImplementationFixture: ContainerSingletonServiceImplementation;

      let taskGraphExpandCommandHandlerMock: jest.Mocked<TaskNodeExpandCommandHandler>;
      let createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateRequestScopedInstanceTaskNodeCommandHandler;
      let createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateSingletonScopedInstanceTaskNodeCommandHandler;
      let createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateTransientScopedInstanceTaskNodeCommandHandler;
      let createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateTypeBindingInstanceTaskNodeCommandHandler;
      let createCreateInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateInstanceTaskNodeCommandHandler;
      let createInstanceTaskGraphExpandCommandHandlerFixture: CreateInstanceTaskNodeExpandCommandHandler;
      let createTagInstancesTaskNodeExpandCommandHandlerFixture: CreateTagInstancesTaskNodeExpandCommandHandler;
      let getInstanceDependenciesTaskGraphExpandCommandHandlerFixture: GetInstanceDependenciesTaskNodeExpandCommandHandler;
      let createInstanceTaskGraphEngineFixture: CreateInstanceTaskGraphEngine;
      let rootedTaskGraphRunnerFixture: cuaktask.RootedTaskGraphRunner;

      let containerInstanceServiceImplementationFixture: ContainerInstanceServiceImplementation;

      let containerModuleTaskDependencyEngineFixture: ContainerModuleTaskDependencyEngine;
      let containerModuleTaskBuilderWithNoDependenciesFixture: ContainerModuleTaskBuilderWithNoDependencies;
      let containerModuleTaskBuilderFixture: ContainerModuleTaskBuilder;

      let dependentTaskRunnerFixture: cuaktask.DependentTaskRunner;

      let containerModuleServiceImplementationFixture: ContainerModuleServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          BindingServiceImplementation,
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

        taskGraphExpandCommandHandlerMock = {
          register: jest.fn(),
        } as Partial<
          jest.Mocked<TaskNodeExpandCommandHandler>
        > as jest.Mocked<TaskNodeExpandCommandHandler>;
        bindFixtureToConstructor(
          TaskNodeExpandCommandHandler,
          taskGraphExpandCommandHandlerMock,
        );

        createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateRequestScopedInstanceTaskNodeCommandHandler,
          createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateSingletonScopedInstanceTaskNodeCommandHandler,
          createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateTransientScopedInstanceTaskNodeCommandHandler,
          createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateTypeBindingInstanceTaskNodeCommandHandler,
          createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createCreateInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateInstanceTaskNodeCommandHandler,
          createCreateInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createInstanceTaskGraphExpandCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateInstanceTaskNodeExpandCommandHandler,
          createInstanceTaskGraphExpandCommandHandlerFixture,
        );

        createTagInstancesTaskNodeExpandCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateTagInstancesTaskNodeExpandCommandHandler,
          createTagInstancesTaskNodeExpandCommandHandlerFixture,
        );

        getInstanceDependenciesTaskGraphExpandCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          GetInstanceDependenciesTaskNodeExpandCommandHandler,
          getInstanceDependenciesTaskGraphExpandCommandHandlerFixture,
        );

        createInstanceTaskGraphEngineFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          CreateInstanceTaskGraphEngine,
          createInstanceTaskGraphEngineFixture,
        );

        rootedTaskGraphRunnerFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          cuaktask.RootedTaskGraphRunner,
          rootedTaskGraphRunnerFixture,
        );

        dependentTaskRunnerFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          cuaktask.DependentTaskRunner,
          dependentTaskRunnerFixture,
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
        expect(BindingServiceImplementation).toHaveBeenCalledTimes(1);
        expect(BindingServiceImplementation).toHaveBeenCalledWith(undefined);
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

      it('should call new TaskGraphExpandCommandHandler()', () => {
        expect(TaskNodeExpandCommandHandler).toHaveBeenCalledTimes(1);
        expect(TaskNodeExpandCommandHandler).toHaveBeenCalledWith();
      });

      it('should call new CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateRequestScopedInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateRequestScopedInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledWith(
          taskGraphExpandCommandHandlerMock,
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
        );
      });

      it('should call new CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateSingletonScopedInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateSingletonScopedInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledWith(
          taskGraphExpandCommandHandlerMock,
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
        );
      });

      it('should call new CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateTransientScopedInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateTransientScopedInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledWith(
          taskGraphExpandCommandHandlerMock,
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
        );
      });

      it('should call new CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateTypeBindingInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateTypeBindingInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledWith(
          createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerFixture,
          createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerFixture,
          createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerFixture,
        );
      });

      it('should call new CreateCreateInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateInstanceTaskNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(CreateCreateInstanceTaskNodeCommandHandler).toHaveBeenCalledWith(
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
          createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerFixture,
        );
      });

      it('should call new CreateInstanceTaskGraphExpandCommandHandler()', () => {
        expect(
          CreateInstanceTaskNodeExpandCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(CreateInstanceTaskNodeExpandCommandHandler).toHaveBeenCalledWith(
          taskGraphExpandCommandHandlerMock,
          metadataServiceImplementationFixture,
        );
      });

      it('should call new CreateTagInstancesTaskNodeExpandCommandHandler()', () => {
        expect(
          CreateTagInstancesTaskNodeExpandCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateTagInstancesTaskNodeExpandCommandHandler,
        ).toHaveBeenCalledWith(
          containerBindingServiceImplementationFixture,
          createCreateInstanceTaskGraphNodeCommandHandlerFixture,
        );
      });

      it('should call new GetInstanceDependenciesTaskGraphExpandCommandHandler()', () => {
        expect(
          GetInstanceDependenciesTaskNodeExpandCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          GetInstanceDependenciesTaskNodeExpandCommandHandler,
        ).toHaveBeenCalledWith(
          containerBindingServiceImplementationFixture,
          taskGraphExpandCommandHandlerMock,
          createCreateInstanceTaskGraphNodeCommandHandlerFixture,
          metadataServiceImplementationFixture,
        );
      });

      it('should call new CreateInstanceTaskGraphEngine()', () => {
        expect(CreateInstanceTaskGraphEngine).toHaveBeenCalledTimes(1);
        expect(CreateInstanceTaskGraphEngine).toHaveBeenCalledWith(
          containerBindingServiceImplementationFixture,
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
          metadataServiceImplementationFixture,
          taskGraphExpandCommandHandlerMock,
        );
      });

      it('should call new ContainerInstanceServiceImplementation()', () => {
        expect(ContainerInstanceServiceImplementation).toHaveBeenCalledTimes(1);
        expect(ContainerInstanceServiceImplementation).toHaveBeenCalledWith(
          containerRequestServiceImplementationFixture,
          rootedTaskGraphRunnerFixture,
          createInstanceTaskGraphEngineFixture,
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
