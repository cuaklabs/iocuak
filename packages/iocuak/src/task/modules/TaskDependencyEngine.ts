import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../common/models/domain/ServiceId';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { Binding } from '../../metadata/models/domain/Binding';
import { BindingType } from '../../metadata/models/domain/BindingType';
import { ClassMetadata } from '../../metadata/models/domain/ClassMetadata';
import { TypeBinding } from '../../metadata/models/domain/TypeBinding';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { isTaskKind } from '../../utils/isTaskKind';
import { stringifyServiceId } from '../../utils/stringifyServiceId';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class TaskDependencyEngine implements cuaktask.TaskDependencyEngine {
  readonly #containerBindingService: ContainerBindingService;
  readonly #metadataService: MetadataService;

  constructor(
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
  ) {
    this.#containerBindingService = containerBindingService;
    this.#metadataService = metadataService;
  }

  public getDependencies<TKind, TDependencyKind>(
    taskKind: TKind,
  ): TDependencyKind[] {
    if (isTaskKind(taskKind)) {
      let dependencies: TDependencyKind[];

      switch (taskKind.type) {
        case TaskKindType.createInstance:
          dependencies = this.#getCreateInstanceTaskKindDependencies(
            taskKind,
          ) as unknown[] as TDependencyKind[];
          break;
        case TaskKindType.getInstanceDependencies:
          dependencies = this.#getGetInstanceDependenciesTaskKindDependencies(
            taskKind,
          ) as unknown[] as TDependencyKind[];
          break;
      }

      return dependencies;
    } else {
      throw new Error('task kind not supported');
    }
  }

  #getBinding(serviceId: ServiceId): Binding {
    const binding: Binding | undefined =
      this.#containerBindingService.get(serviceId);

    if (binding === undefined) {
      throw new Error(
        `No bindings found for type ${stringifyServiceId(serviceId)}`,
      );
    } else {
      return binding;
    }
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
    const metadata: ClassMetadata = taskKind.metadata;

    const constructorArgumentsCreateInstanceTaskKinds: CreateInstanceTaskKind[] =
      metadata.constructorArguments.map(
        (constructorArgument: ServiceId): CreateInstanceTaskKind => ({
          id: constructorArgument,
          requestId: taskKind.requestId,
          type: TaskKindType.createInstance,
        }),
      );

    const propertyCreateInstanceTaskKinds: CreateInstanceTaskKind[] = [
      ...metadata.properties.values(),
    ].map(
      (serviceId: ServiceId): CreateInstanceTaskKind => ({
        id: serviceId,
        requestId: taskKind.requestId,
        type: TaskKindType.createInstance,
      }),
    );

    const createInstanceTaskKinds: CreateInstanceTaskKind[] = [
      ...constructorArgumentsCreateInstanceTaskKinds,
      ...propertyCreateInstanceTaskKinds,
    ];

    return createInstanceTaskKinds;
  }
}
