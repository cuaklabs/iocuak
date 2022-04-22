import { BaseDependentTask, DependentTask } from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { Binding } from '../../../metadata/models/domain/Binding';
import { BindingScope } from '../../../metadata/models/domain/BindingScope';
import { BindingType } from '../../../metadata/models/domain/BindingType';
import { TypeBinding } from '../../../metadata/models/domain/TypeBinding';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { lazyGetBindingOrThrow } from '../../../metadata/utils/domain/lazyGetBindingOrThrow';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { ServiceDependencies } from '../domain/ServiceDependencies';
import { TaskKind } from '../domain/TaskKind';

export class CreateInstanceTask<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> extends BaseDependentTask<
  CreateInstanceTaskKind,
  TaskKind,
  [ServiceDependencies<TArgs>],
  TInstance
> {
  readonly #containerBindingService: ContainerBindingService;
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;
  readonly #metadataService: MetadataService;

  constructor(
    kind: CreateInstanceTaskKind,
    containerBindingService: ContainerBindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    metadataService: MetadataService,
    dependencies: DependentTask<TaskKind, TaskKind, TArgs, TInstance>[] = [],
  ) {
    super(kind, dependencies);

    this.#containerBindingService = containerBindingService;
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
    this.#metadataService = metadataService;
  }

  protected innerPerform(
    serviceDependencies: ServiceDependencies<TArgs>,
  ): TInstance {
    const binding: Binding<TInstance, TArgs> = this.#getBinding(this.kind.id);

    let instance: TInstance;

    switch (binding.bindingType) {
      case BindingType.type:
        instance = this.#createInstanceFromTypeBinding(
          serviceDependencies,
          binding,
        );
        break;
      case BindingType.value:
        instance = binding.value;
    }

    return instance;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #createInstanceFromTypeBinding(
    serviceDependencies: ServiceDependencies<TArgs>,
    binding: TypeBinding<TInstance, TArgs>,
  ): TInstance {
    let instance: TInstance;

    switch (binding.scope) {
      case BindingScope.request:
        instance = this.#createInstanceInRequestScope(
          serviceDependencies,
          binding,
        );
        break;
      case BindingScope.singleton:
        instance = this.#createInstanceInSingletonScope(
          serviceDependencies,
          binding,
        );
        break;
      case BindingScope.transient:
        instance = this.#createInstanceInTransientScope(
          serviceDependencies,
          binding,
        );
        break;
    }

    return instance;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #createInstanceInTransientScope(
    serviceDependencies: ServiceDependencies<TArgs>,
    binding: TypeBinding<TInstance, TArgs>,
  ): TInstance {
    const instance: TInstance = new binding.type(
      ...serviceDependencies.constructorArguments,
    );

    for (const [
      propertyName,
      propertyValue,
    ] of serviceDependencies.properties) {
      (instance as Record<string | symbol, unknown>)[propertyName] =
        propertyValue;
    }

    return instance;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #createInstanceInRequestScope(
    serviceDependencies: ServiceDependencies<TArgs>,
    binding: TypeBinding<TInstance, TArgs>,
  ): TInstance {
    const instanceFromRequestScope: unknown = this.#containerRequestService.get(
      this.kind.requestId,
      this.kind.id,
    );

    let instance: TInstance;

    if (instanceFromRequestScope === undefined) {
      instance = this.#createInstanceInTransientScope(
        serviceDependencies,
        binding,
      );

      this.#containerRequestService.set(
        this.kind.requestId,
        this.kind.id,
        instance,
      );
    } else {
      instance = instanceFromRequestScope as TInstance;
    }

    return instance;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #createInstanceInSingletonScope(
    serviceDependencies: ServiceDependencies<TArgs>,
    binding: TypeBinding<TInstance, TArgs>,
  ): TInstance {
    const instanceFromSingletonScope: unknown =
      this.#containerSingletonService.get(this.kind.id);

    let instance: TInstance;

    if (instanceFromSingletonScope === undefined) {
      instance = this.#createInstanceInTransientScope(
        serviceDependencies,
        binding,
      );

      this.#containerSingletonService.set(this.kind.id, instance);
    } else {
      instance = instanceFromSingletonScope as TInstance;
    }

    return instance;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #getBinding(serviceId: ServiceId): Binding<TInstance, TArgs> {
    const binding: Binding<TInstance, TArgs> =
      this.#containerBindingService.get(serviceId) ??
      lazyGetBindingOrThrow(serviceId, this.#metadataService);

    return binding;
  }
}
