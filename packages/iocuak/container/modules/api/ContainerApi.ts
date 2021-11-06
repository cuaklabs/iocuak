import * as cuaktask from '@cuaklabs/cuaktask';

import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskKind } from '../../../task/models/domain/TaskKind';
import { TaskBuilder } from '../../../task/modules/TaskBuilder';
import { TaskDependencyEngine } from '../../../task/modules/TaskDependencyEngine';
import { TaskKindSet } from '../../../task/modules/TaskKindSet';
import { ContainerApiService } from '../../services/api/ContainerApiService';
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
import { ContainerModuleApi } from './ContainerModuleApi';

export class ContainerApi implements ContainerApiService {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #containerApiService: ContainerApiService;

  constructor() {
    const containerApiService: ContainerApiService =
      this.#initializeContainerApiService();

    this.#containerApiService = containerApiService;
  }

  public bind<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): void {
    this.#containerApiService.bind(type);
  }

  public get<TInstance>(serviceId: ServiceId): TInstance {
    return this.#containerApiService.get(serviceId);
  }

  public load(containerModuleApi: ContainerModuleApi): void {
    this.#containerApiService.load(containerModuleApi);
  }

  public unbind(serviceId: ServiceId): void {
    this.#containerApiService.unbind(serviceId);
  }

  #initializeContainerApiService(): ContainerApiService {
    const containerService: ContainerService =
      this.#initializeContainerService();

    const containerApiService: ContainerApiService =
      new ContainerApiServiceImplementation(containerService);

    return containerApiService;
  }

  #initializeContainerService(): ContainerService {
    const containerBindingService: ContainerBindingService =
      new ContainerBindingServiceImplementation();
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

  #initializeContainerInstanceService(
    containerBindingService: ContainerBindingService,
    containerMetadataService: ContainerMetadataService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ): ContainerInstanceService {
    const dependentTaskRunner: cuaktask.DependentTaskRunner =
      new cuaktask.DependentTaskRunner();

    const taskBuilder: cuaktask.Builder<
      [TaskKind],
      cuaktask.DependentTask<TaskKind, TaskKind>
    > = this.initializeTaskRunner(
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

  private initializeTaskRunner(
    containerBindingService: ContainerBindingService,
    containerMetadataService: ContainerMetadataService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
    const taskDependenciesKindSetBuilder: cuaktask.Builder<
      [],
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
      [TaskKind],
      cuaktask.DependentTask<TaskKind, TaskKind>
    > = new TaskBuilder(
      taskDependenciesKindSetBuilder,
      taskDependencyEngine,
      containerBindingService,
      containerRequestService,
      containerSingletonService,
    );

    return taskBuilder;
  }
}
