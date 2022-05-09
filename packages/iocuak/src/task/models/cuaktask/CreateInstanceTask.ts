import { BaseDependentTask, DependentTask } from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingScope } from '../../../binding/models/domain/BindingScope';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
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
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;

  constructor(
    kind: CreateInstanceTaskKind,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    dependencies: DependentTask<TaskKind, TaskKind, TArgs, TInstance>[] = [],
  ) {
    super(kind, dependencies);

    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
  }

  protected innerPerform(
    serviceDependencies: ServiceDependencies<TArgs>,
  ): TInstance {
    const binding: Binding<TInstance, TArgs> = this.kind.binding as Binding<
      TInstance,
      TArgs
    >;

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
      this.kind.binding.id,
    );

    let instance: TInstance;

    if (instanceFromRequestScope === undefined) {
      instance = this.#createInstanceInTransientScope(
        serviceDependencies,
        binding,
      );

      this.#containerRequestService.set(
        this.kind.requestId,
        this.kind.binding.id,
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
      this.#containerSingletonService.get(this.kind.binding.id);

    let instance: TInstance;

    if (instanceFromSingletonScope === undefined) {
      instance = this.#createInstanceInTransientScope(
        serviceDependencies,
        binding,
      );

      this.#containerSingletonService.set(this.kind.binding.id, instance);
    } else {
      instance = instanceFromSingletonScope as TInstance;
    }

    return instance;
  }
}
