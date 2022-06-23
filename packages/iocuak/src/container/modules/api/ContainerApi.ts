import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingService } from '../../../binding/services/domain/BindingService';
import { BindingServiceImplementation } from '../../../binding/services/domain/BindingServiceImplementation';
import { Builder } from '../../../common/modules/domain/Builder';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerModuleTaskKind } from '../../../containerModuleTask/models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskBuilder } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilder';
import { ContainerModuleTaskBuilderWithNoDependencies } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilderWithNoDependencies';
import { ContainerModuleTaskDependencyEngine } from '../../../containerModuleTask/modules/ContainerModuleTaskDependencyEngine';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../../createInstanceTask/models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { CreateCreateTypeBindingInstanceTaskGraphNodeCommand } from '../../../createInstanceTask/models/cuaktask/CreateCreateTypeBindingInstanceTaskGraphNodeCommand';
import { CreateInstanceTaskGraphExpandCommand } from '../../../createInstanceTask/models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../../createInstanceTask/models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { TaskGraphExpandCommand } from '../../../createInstanceTask/models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../../createInstanceTask/models/cuaktask/TaskGraphExpandCommandType';
import { TaskKind } from '../../../createInstanceTask/models/domain/TaskKind';
import { CreateCreateInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateInstanceTaskGraphNodeCommandHandler';
import { CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler';
import { CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler';
import { CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler';
import { CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler';
import { CreateInstanceTaskGraphEngine } from '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskGraphEngine';
import { CreateInstanceTaskGraphExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/CreateInstanceTaskGraphExpandCommandHandler';
import { GetInstanceDependenciesTaskGraphExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/GetInstanceDependenciesTaskGraphExpandCommandHandler';
import { TaskGraphExpandCommandHandler } from '../../../createInstanceTask/modules/cuaktask/TaskGraphExpandCommandHandler';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { MetadataServiceImplementation } from '../../../metadata/services/domain/MetadataServiceImplementation';
import { ContainerServiceApiImplementation } from '../../services/api/ContainerServiceApiImplementation';
import { ContainerInstanceServiceImplementation } from '../../services/cuaktask/ContainerInstanceServiceImplementation';
import { ContainerModuleServiceImplementation } from '../../services/cuaktask/ContainerModuleServiceImplementation';
import { ContainerInstanceService } from '../../services/domain/ContainerInstanceService';
import { ContainerModuleService } from '../../services/domain/ContainerModuleService';
import { ContainerRequestService } from '../../services/domain/ContainerRequestService';
import { ContainerRequestServiceImplementation } from '../../services/domain/ContainerRequestServiceImplementation';
import { ContainerService } from '../../services/domain/ContainerService';
import { ContainerSingletonService } from '../../services/domain/ContainerSingletonService';
import { ContainerSingletonServiceImplementation } from '../../services/domain/ContainerSingletonServiceImplementation';

export class ContainerApi extends ContainerServiceApiImplementation {
  private constructor(containerService?: ContainerService) {
    super(containerService ?? ContainerApi.#initializeContainerService());
  }

  public static build(): ContainerApi {
    const containerApi: ContainerApi = new ContainerApi();

    return containerApi;
  }

  static #initializeContainerService(
    parentContainerBindingService?: BindingService,
  ): ContainerService {
    const containerBindingService: BindingService =
      new BindingServiceImplementation(parentContainerBindingService);
    const metadataService: MetadataService =
      new MetadataServiceImplementation();
    const containerRequestService: ContainerRequestService =
      new ContainerRequestServiceImplementation();
    const containerSingletonService: ContainerSingletonService =
      new ContainerSingletonServiceImplementation();
    const containerInstanceService: ContainerInstanceService =
      this.#initializeContainerInstanceService(
        containerBindingService,
        containerRequestService,
        containerSingletonService,
        metadataService,
      );
    const containerModuleService: ContainerModuleService =
      ContainerApi.#initializeContainerModuleService(
        containerBindingService,
        containerInstanceService,
        metadataService,
      );

    const containerService: ContainerService = {
      binding: containerBindingService,
      instance: containerInstanceService,
      metadata: metadataService,
      module: containerModuleService,
      request: containerRequestService,
      singleton: containerSingletonService,
    };
    return containerService;
  }

  static #initializeContainerInstanceService(
    containerBindingService: BindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    metadataService: MetadataService,
  ): ContainerInstanceService {
    const taskGraphEngine: cuaktask.TaskGraphEngine<TaskKind> =
      this.#initializeTaskEngine(
        containerBindingService,
        containerRequestService,
        containerSingletonService,
        metadataService,
      );

    const rootedTaskGraphRunner: cuaktask.RootedTaskGraphRunner =
      new cuaktask.RootedTaskGraphRunner();

    const containerInstanceService: ContainerInstanceService =
      new ContainerInstanceServiceImplementation(
        containerRequestService,
        rootedTaskGraphRunner,
        taskGraphEngine,
      );
    return containerInstanceService;
  }

  static #initializeContainerModuleService(
    containerBindingService: BindingService,
    containerInstanceService: ContainerInstanceService,
    metadataService: MetadataService,
  ): ContainerModuleService {
    const taskBuilder: Builder<
      cuaktask.DependentTask<ContainerModuleTaskKind, ContainerModuleTaskKind>,
      [ContainerModuleTaskKind]
    > = ContainerApi.#initializeContainerModuleTaskBuilder(
      containerBindingService,
      containerInstanceService,
      metadataService,
    );

    const dependentTaskRunner: cuaktask.DependentTaskRunner =
      new cuaktask.DependentTaskRunner();

    const containerModuleService: ContainerModuleService =
      new ContainerModuleServiceImplementation(
        taskBuilder,
        dependentTaskRunner,
      );

    return containerModuleService;
  }

  static #initializeCreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler(
    taskGraphExpandCommandHandler: Handler<
      TaskGraphExpandCommand,
      void | Promise<void>
    >,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ): Handler<
    CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  > {
    const createCreateRequestScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateRequestScopedInstanceTaskGraphNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler(
      createCreateRequestScopedInstanceTaskGraphNodeCommandHandler,
      createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler,
      createCreateTransientScopedInstanceTaskGraphNodeCommandHandler,
    );

    return createCreateTypeBindingInstanceTaskGraphNodeCommandHandler;
  }

  static #initializeCreateCreateInstanceTaskGraphNodeCommandHandler(
    taskGraphExpandCommandHandler: Handler<
      TaskGraphExpandCommand,
      void | Promise<void>
    >,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ): Handler<
    CreateCreateInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  > {
    const createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = this.#initializeCreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateInstanceTaskGraphNodeCommandHandler(
      containerRequestService,
      containerSingletonService,
      createCreateTypeBindingInstanceTaskGraphNodeCommandHandler,
    );

    return createCreateInstanceTaskGraphNodeCommandHandler;
  }

  static #initializeGetInstanceDependenciesTaskGraphExpandCommandHandler(
    taskGraphExpandCommandHandler: Handler<
      TaskGraphExpandCommand,
      void | Promise<void>
    >,
    containerBindingService: BindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    metadataService: MetadataService,
  ): Handler<GetInstanceDependenciesTaskGraphExpandCommand, void> {
    const createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = this.#initializeCreateCreateInstanceTaskGraphNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const getInstanceDependenciesTaskGraphExpandCommandHandler: Handler<
      GetInstanceDependenciesTaskGraphExpandCommand,
      void
    > = new GetInstanceDependenciesTaskGraphExpandCommandHandler(
      containerBindingService,
      containerRequestService,
      containerSingletonService,
      createCreateInstanceTaskGraphNodeCommandHandler,
      metadataService,
    );

    return getInstanceDependenciesTaskGraphExpandCommandHandler;
  }

  static #initializeTaskEngine(
    containerBindingService: BindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    metadataService: MetadataService,
  ): cuaktask.TaskGraphEngine<TaskKind> {
    const taskGraphExpandCommandHandler: TaskGraphExpandCommandHandler =
      new TaskGraphExpandCommandHandler();

    const createInstanceTaskGraphExpandCommandHandler: Handler<
      CreateInstanceTaskGraphExpandCommand,
      void
    > = new CreateInstanceTaskGraphExpandCommandHandler(
      taskGraphExpandCommandHandler,
      metadataService,
    );

    const getInstanceDependenciesTaskGraphExpandCommandHandler: Handler<
      GetInstanceDependenciesTaskGraphExpandCommand,
      void
    > = this.#initializeGetInstanceDependenciesTaskGraphExpandCommandHandler(
      taskGraphExpandCommandHandler,
      containerBindingService,
      containerRequestService,
      containerSingletonService,
      metadataService,
    );

    taskGraphExpandCommandHandler.register(
      TaskGraphExpandCommandType.createInstance,
      createInstanceTaskGraphExpandCommandHandler,
    );

    taskGraphExpandCommandHandler.register(
      TaskGraphExpandCommandType.getInstanceDependencies,
      getInstanceDependenciesTaskGraphExpandCommandHandler,
    );

    const taskGraphEngine: cuaktask.TaskGraphEngine<TaskKind> =
      new CreateInstanceTaskGraphEngine(
        containerBindingService,
        containerRequestService,
        containerSingletonService,
        metadataService,
        taskGraphExpandCommandHandler,
      );

    return taskGraphEngine;
  }

  static #initializeContainerModuleTaskBuilder(
    containerBindingService: BindingService,
    containerInstanceService: ContainerInstanceService,
    metadataService: MetadataService,
  ): Builder<
    cuaktask.DependentTask<ContainerModuleTaskKind, ContainerModuleTaskKind>,
    [ContainerModuleTaskKind]
  > {
    const containerModuleTaskDependencyEngine: ContainerModuleTaskDependencyEngine =
      new ContainerModuleTaskDependencyEngine();

    const taskBuilderWithNoDependencies: ContainerModuleTaskBuilderWithNoDependencies =
      new ContainerModuleTaskBuilderWithNoDependencies(
        containerBindingService,
        containerInstanceService,
        metadataService,
      );

    const taskBuilder: Builder<
      cuaktask.DependentTask<ContainerModuleTaskKind, ContainerModuleTaskKind>,
      [ContainerModuleTaskKind]
    > = new ContainerModuleTaskBuilder(
      containerModuleTaskDependencyEngine,
      taskBuilderWithNoDependencies,
    );

    return taskBuilder;
  }

  public createChild(): ContainerApi {
    const childContainerService: ContainerService =
      ContainerApi.#initializeContainerService(this._containerService.binding);
    const childContainerApi: ContainerApi = new ContainerApi(
      childContainerService,
    );

    return childContainerApi;
  }
}
