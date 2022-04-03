import * as cuaktask from '@cuaklabs/cuaktask';

import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { MetadataServiceImplementation } from '../../../metadata/services/domain/MetadataServiceImplementation';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { TaskBuilder } from '../../../task/modules/TaskBuilder';
import { TaskDependencyEngine } from '../../../task/modules/TaskDependencyEngine';
import { TaskKindSet } from '../../../task/modules/TaskKindSet';
import { ContainerServiceApiImplementation } from '../../services/api/ContainerServiceApiImplementation';
import { ContainerInstanceServiceImplementation } from '../../services/cuaktask/ContainerInstanceServiceImplementation';
import { ContainerBindingService } from '../../services/domain/ContainerBindingService';
import { ContainerBindingServiceImplementation } from '../../services/domain/ContainerBindingServiceImplementation';
import { ContainerInstanceService } from '../../services/domain/ContainerInstanceService';
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

    const containerService: ContainerService = {
      binding: containerBindingService,
      instance: containerInstanceService,
      metadata: metadataService,
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

    const taskBuilder: cuaktask.Builder<
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

  static #initializeTaskBuilder(
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
    const taskDependencyEngine: cuaktask.TaskDependencyEngine =
      new TaskDependencyEngine(containerBindingService, metadataService);

    const taskDependenciesKindSetBuilder: cuaktask.Builder<
      cuaktask.SetLike<TaskKind>
    > = {
      build: () => new TaskKindSet(),
    };

    const taskBuilder: cuaktask.Builder<
      cuaktask.DependentTask<TaskKind, TaskKind>,
      [TaskKind]
    > = new TaskBuilder(
      taskDependencyEngine,
      taskDependenciesKindSetBuilder,
      containerBindingService,
      containerRequestService,
      containerSingletonService,
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
