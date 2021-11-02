import { BaseDependentTask, DependentTask } from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { stringifyServiceId } from '../../../utils/stringifyServiceId';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { ServiceDependencies } from '../domain/ServiceDependencies';
import { TaskKind } from '../domain/TaskKind';
import { TaskScope } from '../domain/TaskScope';

export class CreateInstanceTask<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> extends BaseDependentTask<
  CreateInstanceTaskKind,
  TaskKind,
  [ServiceDependencies<TArgs>],
  TInstance
> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #containerBindingService: ContainerBindingService;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #containerRequestService: ContainerRequestService;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #containerSingletonService: ContainerSingletonService;

  constructor(
    kind: CreateInstanceTaskKind,
    containerBindingService: ContainerBindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    dependencies: DependentTask<TaskKind, TaskKind, TArgs, TInstance>[] = [],
  ) {
    super(kind, dependencies);

    this.#containerBindingService = containerBindingService;
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
  }

  protected innerPerform(
    serviceDependencies: ServiceDependencies<TArgs>,
  ): TInstance {
    const binding: Binding<TInstance, TArgs> | undefined =
      this.#containerBindingService.get(this.kind.id);

    if (binding === undefined) {
      throw new Error(
        `No bindings found for type ${stringifyServiceId(this.kind.id)}`,
      );
    } else {
      let instance: TInstance;

      switch (binding.scope) {
        case TaskScope.request:
          instance = this.#createInstanceInRequestScope(
            serviceDependencies,
            binding,
          );
          break;
        case TaskScope.singleton:
          instance = this.#createInstanceInSingletonScope(
            serviceDependencies,
            binding,
          );
          break;
        case TaskScope.transient:
          instance = this.#createInstanceInTransientScope(
            serviceDependencies,
            binding,
          );
          break;
      }

      return instance;
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #createInstanceInTransientScope(
    serviceDependencies: ServiceDependencies<TArgs>,
    binding: Binding<TInstance, TArgs>,
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
    binding: Binding<TInstance, TArgs>,
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
    binding: Binding<TInstance, TArgs>,
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
}
