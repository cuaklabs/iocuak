import * as cuaktask from '@cuaklabs/cuaktask';

import { Builder } from '../../../common/modules/domain/Builder';
import { SetLike } from '../../../common/modules/domain/SetLike';
import { ContainerModuleTaskKind } from '../../../containerModuleTask/models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskBuilder } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilder';
import { ContainerModuleTaskBuilderWithNoDependencies } from '../../../containerModuleTask/modules/ContainerModuleTaskBuilderWithNoDependencies';
import { ContainerModuleTaskDependencyEngine } from '../../../containerModuleTask/modules/ContainerModuleTaskDependencyEngine';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { MetadataServiceImplementation } from '../../../metadata/services/domain/MetadataServiceImplementation';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { DirectTaskDependencyEngine } from '../../../task/modules/DirectTaskDependencyEngine';
import { TaskBuilder } from '../../../task/modules/TaskBuilder';
import { TaskBuilderWithNoDependencies } from '../../../task/modules/TaskBuilderWithNoDependencies';
import { TaskDependencyEngine } from '../../../task/modules/TaskDependencyEngine';
import { TaskKindSet } from '../../../task/modules/TaskKindSet';
import { ContainerServiceApiImplementation } from '../../services/api/ContainerServiceApiImplementation';
import { ContainerInstanceServiceImplementation } from '../../services/cuaktask/ContainerInstanceServiceImplementation';
import { ContainerBindingService } from '../../services/domain/ContainerBindingService';
import { ContainerBindingServiceImplementation } from '../../services/domain/ContainerBindingServiceImplementation';
import { ContainerInstanceService } from '../../services/domain/ContainerInstanceService';
import { ContainerModuleService } from '../../services/domain/ContainerModuleService';
import { ContainerModuleServiceImplementation } from '../../services/domain/ContainerModuleServiceImplementation';
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
    parentContainerBindingService?: ContainerBindingService,
  ): ContainerService {
    const containerBindingService: ContainerBindingService =
      new ContainerBindingServiceImplementation(parentContainerBindingService);
    const metadataService: MetadataService =
      new MetadataServiceImplementation();
    const containerRequestService: ContainerRequestService =
      new ContainerRequestServiceImplementation();
    const containerSingletonService: ContainerSingletonService =
      new ContainerSingletonServiceImplementation();
    const containerInstanceService: ContainerInstanceService =
      this.#initializeContainerInstanceService(
        containerBindingService,
        metadataService,
        containerRequestService,
        containerSingletonService,
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
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ): ContainerInstanceService {
    const dependentTaskRunner: cuaktask.DependentTaskRunner =
      new cuaktask.DependentTaskRunner();

    const taskBuilder: Builder<
      cuaktask.DependentTask<TaskKind, TaskKind>,
      [TaskKind]
    > = this.#initializeTaskBuilder(
      containerBindingService,
      metadataService,
      containerRequestService,
      containerSingletonService,
    );

    const containerInstanceService: ContainerInstanceService =
      new ContainerInstanceServiceImplementation(
        containerRequestService,
        dependentTaskRunner,
        taskBuilder,
      );
    return containerInstanceService;
  }

  static #initializeContainerModuleService(
    containerBindingService: ContainerBindingService,
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

  static #initializeTaskBuilder(
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ): Builder<cuaktask.DependentTask<TaskKind, TaskKind>, [TaskKind]> {
    const taskDependenciesKindSetBuilder: Builder<SetLike<TaskKind>> = {
      build: () => new TaskKindSet(),
    };

    const directTaskDependencyEngine: DirectTaskDependencyEngine =
      new DirectTaskDependencyEngine(containerBindingService, metadataService);

    const taskDependencyEngine: cuaktask.TaskDependencyEngine<
      TaskKind,
      TaskKind
    > = new TaskDependencyEngine(
      directTaskDependencyEngine,
      taskDependenciesKindSetBuilder,
    );

    const taskBuilderWithNoDependencies: TaskBuilderWithNoDependencies =
      new TaskBuilderWithNoDependencies(
        containerBindingService,
        containerRequestService,
        containerSingletonService,
      );

    const taskBuilder: Builder<
      cuaktask.DependentTask<TaskKind, TaskKind>,
      [TaskKind]
    > = new TaskBuilder(taskDependencyEngine, taskBuilderWithNoDependencies);

    return taskBuilder;
  }

  static #initializeContainerModuleTaskBuilder(
    containerBindingService: ContainerBindingService,
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
