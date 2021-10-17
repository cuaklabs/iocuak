import { BaseDependentTask } from '@cuaklabs/cuaktask';

import { DependentTask } from '../../../../cuaktask/task/models/domain/DependentTask';
import { ContainerService } from '../../../container/services/domain/ContainerService';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { Newable } from '../domain/Newable';
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
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #instanceConstructor: Newable<TInstance, TArgs>;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #containerService: ContainerService;

  constructor(
    instanceConstructor: Newable<TInstance, TArgs>,
    containerService: ContainerService,
    kind: CreateInstanceTaskKind,
    dependencies: DependentTask<TaskKind, TaskKind, TArgs, TInstance>[] = [],
  ) {
    super(kind, dependencies);

    this.#instanceConstructor = instanceConstructor;
    this.#containerService = containerService;
  }

  protected innerPerform(
    serviceDependencies: ServiceDependencies<TArgs>,
  ): TInstance {
    const instanceFromSingletonScope: unknown =
      this.#containerService.singleton.get(this.kind.id);

    let instance: TInstance;

    if (instanceFromSingletonScope === undefined) {
      instance = new this.#instanceConstructor(
        ...serviceDependencies.constructorArguments,
      );

      for (const propertyName in serviceDependencies.properties) {
        (instance as Record<string, unknown>)[propertyName] =
          serviceDependencies.properties[propertyName];
      }
    } else {
      instance = instanceFromSingletonScope as TInstance;
    }

    return instance;
  }
}
