import { Binding } from '../../binding/models/domain/Binding';
import { BindingType } from '../../binding/models/domain/BindingType';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { lazyGetBindingOrThrow } from '../../binding/utils/domain/lazyGetBindingOrThrow';
import { ClassMetadata } from '../../classMetadata/models/domain/ClassMetadata';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class DirectTaskDependencyEngine {
  readonly #containerBindingService: ContainerBindingService;
  readonly #metadataService: MetadataService;

  constructor(
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
  ) {
    this.#containerBindingService = containerBindingService;
    this.#metadataService = metadataService;
  }

  public getDirectDependencies(taskKind: TaskKind): TaskKind[] {
    let dependencies: TaskKind[];

    switch (taskKind.type) {
      case TaskKindType.createInstance:
        dependencies = this.#getCreateInstanceTaskKindDependencies(
          taskKind,
        ) as unknown[] as TaskKind[];
        break;
      case TaskKindType.getInstanceDependencies:
        dependencies = this.#getGetInstanceDependenciesTaskKindDependencies(
          taskKind,
        ) as unknown[] as TaskKind[];
        break;
    }

    return dependencies;
  }

  #getBinding(serviceId: ServiceId): Binding {
    const binding: Binding =
      this.#containerBindingService.get(serviceId) ??
      lazyGetBindingOrThrow(serviceId, this.#metadataService);

    return binding;
  }

  #getCreateInstanceTaskKindDependencies(
    taskKind: CreateInstanceTaskKind,
  ): TaskKind[] {
    const serviceId: ServiceId = taskKind.id;
    const binding: Binding = this.#getBinding(serviceId);

    let taskKindDependencies: TaskKind[];

    switch (binding.bindingType) {
      case BindingType.type:
        taskKindDependencies =
          this.#getCreateInstanceTaskKindDependenciesFromType(
            taskKind,
            binding,
          );
        break;
      case BindingType.value:
        taskKindDependencies = [];
        break;
    }

    return taskKindDependencies;
  }

  #getCreateInstanceTaskKindDependenciesFromType(
    taskKind: CreateInstanceTaskKind,
    binding: TypeBinding,
  ): TaskKind[] {
    const metadata: ClassMetadata = this.#metadataService.getClassMetadata(
      binding.type,
    );

    const getInstanceDependenciesTaskKind: GetInstanceDependenciesTaskKind = {
      id: taskKind.id,
      metadata: metadata,
      requestId: taskKind.requestId,
      type: TaskKindType.getInstanceDependencies,
    };

    return [getInstanceDependenciesTaskKind];
  }

  #getGetInstanceDependenciesTaskKindDependencies(
    taskKind: GetInstanceDependenciesTaskKind,
  ): TaskKind[] {
    const serviceIds: ServiceId[] =
      this.#getInstanceDependenciesTaskKindDependenciesServiceIds(taskKind);

    const createInstanceTaskKinds: CreateInstanceTaskKind[] = serviceIds.map(
      (serviceId: ServiceId) => ({
        id: serviceId,
        requestId: taskKind.requestId,
        type: TaskKindType.createInstance,
      }),
    );

    return createInstanceTaskKinds;
  }

  #getInstanceDependenciesTaskKindDependenciesServiceIds(
    taskKind: GetInstanceDependenciesTaskKind,
  ): ServiceId[] {
    const metadata: ClassMetadata = taskKind.metadata;

    // GetInstanceDependenciesTask.innerPerfomr relies on this order
    const servicesId: ServiceId[] = [
      ...metadata.constructorArguments,
      ...metadata.properties.values(),
    ];

    return servicesId;
  }
}
