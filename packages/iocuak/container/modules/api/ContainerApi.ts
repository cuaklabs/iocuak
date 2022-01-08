import * as cuaktask from '@cuaklabs/cuaktask';

import { TaskKind } from '../../../task/models/domain/TaskKind';
import { TaskBuilder } from '../../../task/modules/TaskBuilder';
import { TaskDependencyEngine } from '../../../task/modules/TaskDependencyEngine';
import { TaskKindSet } from '../../../task/modules/TaskKindSet';
import { ContainerApiServiceImplementation } from '../../services/api/ContainerApiServiceImplementation';
import { ContainerInstanceServiceImplementation } from '../../services/cuaktask/ContainerInstanceServiceImplementation';
import { ContainerBindingService } from '../../services/domain/ContainerBindingService';
import { ContainerBindingServiceImplementation } from '../../services/domain/ContainerBindingServiceImplementation';
import { ContainerInstanceService } from '../../services/domain/ContainerInstanceService';
import { ContainerMetadataService } from '../../services/domain/ContainerMetadataService';
import { ContainerMetadataServiceImplementation } from '../../services/domain/ContainerMetadataServiceImplementation';
import { ContainerRequestService } from '../../services/domain/ContainerRequestService';
import { ContainerRequestServiceImplementation } from '../../services/domain/ContainerRequestServiceImplementation';
import { ContainerService } from '../../services/domain/ContainerService';
import { ContainerSingletonService } from '../../services/domain/ContainerSingletonService';
import { ContainerSingletonServiceImplementation } from '../../services/domain/ContainerSingletonServiceImplementation';

export class ContainerApi extends ContainerApiServiceImplementation {
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
    const containerMetadataService: ContainerMetadataService =
      new ContainerMetadataServiceImplementation();
    const containerRequestService: ContainerRequestService =
      new ContainerRequestServiceImplementation();
    const containerSingletonService: ContainerSingletonService =
      new ContainerSingletonServiceImplementation();

    const containerInstanceService: ContainerInstanceService =
      this.#initializeContainerInstanceService(
        containerBindingService,
        containerMetadataService,
        containerRequestService,
        containerSingletonService,
      );

    const containerService: ContainerService = {
      binding: containerBindingService,
      instance: containerInstanceService,
      metadata: containerMetadataService,
      request: containerRequestService,
      singleton: containerSingletonService,
    };
    return containerService;
  }

  static #initializeContainerInstanceService(
    containerBindingService: ContainerBindingService,
    containerMetadataService: ContainerMetadataService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ): ContainerInstanceService {
    const dependentTaskRunner: cuaktask.DependentTaskRunner =
      new cuaktask.DependentTaskRunner();

    const taskBuilder: cuaktask.Builder<
      cuaktask.DependentTask<TaskKind, TaskKind>,
      [TaskKind]
    > = this.#initializeTaskRunner(
      containerBindingService,
      containerMetadataService,
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

  static #initializeTaskRunner(
    containerBindingService: ContainerBindingService,
    containerMetadataService: ContainerMetadataService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
    const taskDependenciesKindSetBuilder: cuaktask.Builder<
      cuaktask.SetLike<TaskKind>
    > = {
      build: () => new TaskKindSet(),
    };

    const taskDependencyEngine: cuaktask.TaskDependencyEngine =
      new TaskDependencyEngine(
        containerBindingService,
        containerMetadataService,
      );

    const taskBuilder: cuaktask.Builder<
      cuaktask.DependentTask<TaskKind, TaskKind>,
      [TaskKind]
    > = new TaskBuilder(
      taskDependenciesKindSetBuilder,
      taskDependencyEngine,
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
