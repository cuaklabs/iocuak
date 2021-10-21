import { BaseDependentTask, DependentTask } from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
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
  #containerBindingService: ContainerBindingService;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #containerSingletonService: ContainerSingletonService;

  constructor(
    kind: CreateInstanceTaskKind,
    containerBindingService: ContainerBindingService,
    containerSingletonService: ContainerSingletonService,
    dependencies: DependentTask<TaskKind, TaskKind, TArgs, TInstance>[] = [],
  ) {
    super(kind, dependencies);

    this.#containerBindingService = containerBindingService;
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
