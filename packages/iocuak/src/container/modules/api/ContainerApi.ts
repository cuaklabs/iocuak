import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingService } from '../../../binding/services/domain/BindingService';
import { BindingServiceImplementation } from '../../../binding/services/domain/BindingServiceImplementation';
import { Builder } from '../../../common/modules/domain/Builder';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerModuleTaskKind } from '../../../containerModuleTask/models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskBuilder } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilder';
import { ContainerModuleTaskBuilderWithNoDependencies } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilderWithNoDependencies';
import { ContainerModuleTaskDependencyEngine } from '../../../containerModuleTask/modules/ContainerModuleTaskDependencyEngine';
import { CreateCreateInstanceTaskNodeCommand } from '../../../createInstanceTask/models/cuaktask/CreateCreateInstanceTaskNodeCommand';
import { CreateCreateTypeBindingInstanceTaskNodeCommand } from '../../../createInstanceTask/models/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommand';
import { CreateInstanceTaskNodeExpandCommand } from '../../../createInstanceTask/models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { CreateTagInstancesTaskNodeExpandCommand } from '../../../createInstanceTask/models/cuaktask/CreateTagInstancesTaskNodeExpandCommand';
import { GetInstanceDependenciesTaskNodeExpandCommand } from '../../../createInstanceTask/models/cuaktask/GetInstanceDependenciesTaskNodeExpandCommand';
import { TaskNodeExpandCommand } from '../../../createInstanceTask/models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../../createInstanceTask/models/cuaktask/TaskNodeExpandCommandType';
import { TaskKind } from '../../../createInstanceTask/models/domain/TaskKind';
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
      TaskNodeExpandCommand,
      void | Promise<void>
    >,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ): Handler<
    CreateCreateTypeBindingInstanceTaskNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  > {
    const createCreateRequestScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateRequestScopedInstanceTaskNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateSingletonScopedInstanceTaskNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateTransientScopedInstanceTaskNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateTypeBindingInstanceTaskNodeCommandHandler(
      createCreateRequestScopedInstanceTaskGraphNodeCommandHandler,
      createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler,
      createCreateTransientScopedInstanceTaskGraphNodeCommandHandler,
    );

    return createCreateTypeBindingInstanceTaskGraphNodeCommandHandler;
  }

  static #initializeCreateCreateInstanceTaskGraphNodeCommandHandler(
    taskGraphExpandCommandHandler: Handler<
      TaskNodeExpandCommand,
      void | Promise<void>
    >,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ): Handler<
    CreateCreateInstanceTaskNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  > {
    const createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = this.#initializeCreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = new CreateCreateInstanceTaskNodeCommandHandler(
      containerRequestService,
      containerSingletonService,
      createCreateTypeBindingInstanceTaskGraphNodeCommandHandler,
    );

    return createCreateInstanceTaskGraphNodeCommandHandler;
  }

  static #initializeGetInstanceDependenciesTaskGraphExpandCommandHandler(
    taskGraphExpandCommandHandler: Handler<
      TaskNodeExpandCommand,
      void | Promise<void>
    >,
    createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    containerBindingService: BindingService,
    metadataService: MetadataService,
  ): Handler<GetInstanceDependenciesTaskNodeExpandCommand, void> {
    const getInstanceDependenciesTaskGraphExpandCommandHandler: Handler<
      GetInstanceDependenciesTaskNodeExpandCommand,
      void
    > = new GetInstanceDependenciesTaskNodeExpandCommandHandler(
      containerBindingService,
      taskGraphExpandCommandHandler,
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
    const taskGraphExpandCommandHandler: TaskNodeExpandCommandHandler =
      new TaskNodeExpandCommandHandler();

    const createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = this.#initializeCreateCreateInstanceTaskGraphNodeCommandHandler(
      taskGraphExpandCommandHandler,
      containerRequestService,
      containerSingletonService,
    );

    const createInstanceTaskGraphExpandCommandHandler: Handler<
      CreateInstanceTaskNodeExpandCommand,
      void
    > = new CreateInstanceTaskNodeExpandCommandHandler(
      taskGraphExpandCommandHandler,
      metadataService,
    );

    const createTagInstancesTaskNodeExpandCommandHandler: Handler<
      CreateTagInstancesTaskNodeExpandCommand,
      void
    > = new CreateTagInstancesTaskNodeExpandCommandHandler(
      containerBindingService,
      createCreateInstanceTaskGraphNodeCommandHandler,
    );

    const getInstanceDependenciesTaskGraphExpandCommandHandler: Handler<
      GetInstanceDependenciesTaskNodeExpandCommand,
      void
    > = this.#initializeGetInstanceDependenciesTaskGraphExpandCommandHandler(
      taskGraphExpandCommandHandler,
      createCreateInstanceTaskGraphNodeCommandHandler,
      containerBindingService,
      metadataService,
    );

    taskGraphExpandCommandHandler.register(
      TaskNodeExpandCommandType.createInstance,
      createInstanceTaskGraphExpandCommandHandler,
    );

    taskGraphExpandCommandHandler.register(
      TaskNodeExpandCommandType.createTagInstances,
      createTagInstancesTaskNodeExpandCommandHandler,
    );

    taskGraphExpandCommandHandler.register(
      TaskNodeExpandCommandType.getInstanceDependencies,
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
