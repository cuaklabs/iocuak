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
  '../../../createInstanceTask/modules/cuaktask/CreateCreateInstanceTaskGraphNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskGraphEngine',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskGraphExpandCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/GetInstanceDependenciesTaskGraphExpandCommandHandler',
);
jest.mock(
  '../../../createInstanceTask/modules/cuaktask/TaskGraphExpandCommandHandler',
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
import { CreateCreateInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateInstanceTaskGraphNodeCommandHandler';
import { CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler';
import { CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler';
import { CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler';
import { CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler';
import { CreateInstanceTaskGraphEngine } from '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskGraphEngine';
import { CreateInstanceTaskGraphExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskGraphExpandCommandHandler';
import { GetInstanceDependenciesTaskGraphExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/GetInstanceDependenciesTaskGraphExpandCommandHandler';
import { TaskGraphExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/TaskGraphExpandCommandHandler';
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

      let taskGraphExpandCommandHandlerMock: jest.Mocked<TaskGraphExpandCommandHandler>;
      let createInstanceTaskGraphExpandCommandHandlerFixture: CreateInstanceTaskGraphExpandCommandHandler;
      let createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler;
      let createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler;
      let createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler;
      let createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler;
      let createCreateInstanceTaskGraphNodeCommandHandlerFixture: CreateCreateInstanceTaskGraphNodeCommandHandler;
      let getInstanceDependenciesTaskGraphExpandCommandHandlerFixture: GetInstanceDependenciesTaskGraphExpandCommandHandler;
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
          jest.Mocked<TaskGraphExpandCommandHandler>
        > as jest.Mocked<TaskGraphExpandCommandHandler>;
        bindFixtureToConstructor(
          TaskGraphExpandCommandHandler,
          taskGraphExpandCommandHandlerMock,
        );

        createInstanceTaskGraphExpandCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateInstanceTaskGraphExpandCommandHandler,
          createInstanceTaskGraphExpandCommandHandlerFixture,
        );

        createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler,
          createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler,
          createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler,
          createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler,
          createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerFixture,
        );

        createCreateInstanceTaskGraphNodeCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          CreateCreateInstanceTaskGraphNodeCommandHandler,
          createCreateInstanceTaskGraphNodeCommandHandlerFixture,
        );

        getInstanceDependenciesTaskGraphExpandCommandHandlerFixture =
          buildEmptyFixture();
        bindFixtureToConstructor(
          GetInstanceDependenciesTaskGraphExpandCommandHandler,
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
        expect(TaskGraphExpandCommandHandler).toHaveBeenCalledTimes(1);
        expect(TaskGraphExpandCommandHandler).toHaveBeenCalledWith();
      });

      it('should call new CreateInstanceTaskGraphExpandCommandHandler()', () => {
        expect(
          CreateInstanceTaskGraphExpandCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateInstanceTaskGraphExpandCommandHandler,
        ).toHaveBeenCalledWith(
          taskGraphExpandCommandHandlerMock,
          metadataServiceImplementationFixture,
        );
      });

      it('should call new CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledWith(
          taskGraphExpandCommandHandlerMock,
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
        );
      });

      it('should call new CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledWith(
          taskGraphExpandCommandHandlerMock,
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
        );
      });

      it('should call new CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledWith(
          taskGraphExpandCommandHandlerMock,
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
        );
      });

      it('should call new CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledWith(
          createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerFixture,
          createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerFixture,
          createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerFixture,
        );
      });

      it('should call new CreateCreateInstanceTaskGraphNodeCommandHandler()', () => {
        expect(
          CreateCreateInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateCreateInstanceTaskGraphNodeCommandHandler,
        ).toHaveBeenCalledWith(
          containerRequestServiceImplementationFixture,
          containerSingletonServiceImplementationFixture,
          createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerFixture,
        );
      });

      it('should call new GetInstanceDependenciesTaskGraphExpandCommandHandler()', () => {
        expect(
          GetInstanceDependenciesTaskGraphExpandCommandHandler,
        ).toHaveBeenCalledTimes(1);
        expect(
          GetInstanceDependenciesTaskGraphExpandCommandHandler,
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
