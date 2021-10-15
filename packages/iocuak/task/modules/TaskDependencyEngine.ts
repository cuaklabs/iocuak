import * as cuaktask from '@cuaklabs/cuaktask';

import { ClassMetadataProvider } from '../../metadata/adapters/ClassMetadataProvider';
import { ClassMetadata } from '../../metadata/models/domain/ClassMetadata';
import { isTaskKind } from '../../utils/isTaskKind';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { ServiceId } from '../models/domain/ServiceId';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class TaskDependencyEngine implements cuaktask.TaskDependencyEngine {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #classMetadataProvider: ClassMetadataProvider;

  constructor(classMetadataProvider: ClassMetadataProvider) {
    this.#classMetadataProvider = classMetadataProvider;
  }

  public getDependencies<TKind, TDependencyKind>(
    taskKind: TKind,
  ): TDependencyKind[] {
    if (isTaskKind(taskKind)) {
      let dependencies: TDependencyKind[];

      switch (taskKind.type) {
        case TaskKindType.createInstance:
          dependencies = this.getCreateInstanceTaskKindDependencies(
            taskKind,
          ) as unknown[] as TDependencyKind[];
          break;
        case TaskKindType.getInstanceDependencies:
          dependencies = this.getGetInstanceDependenciesTaskKindDependencies(
            taskKind,
          ) as unknown[] as TDependencyKind[];
          break;
      }

      return dependencies;
    } else {
      throw new Error('task kind not supported');
    }
  }

  private getCreateInstanceTaskKindDependencies(
    taskKind: CreateInstanceTaskKind,
  ): TaskKind[] {
    const metadata: ClassMetadata = this.#classMetadataProvider.getMetadata(
      taskKind.id,
    );

    const getInstanceDependenciesTaskKind: GetInstanceDependenciesTaskKind = {
      id: taskKind.id,
      metadata: metadata,
      type: TaskKindType.getInstanceDependencies,
    };

    return [getInstanceDependenciesTaskKind];
  }

  private getGetInstanceDependenciesTaskKindDependencies(
    taskKind: GetInstanceDependenciesTaskKind,
  ): TaskKind[] {
    const metadata: ClassMetadata = taskKind.metadata;

    const constructorArgumentsCreateInstanceTaskKinds: CreateInstanceTaskKind[] =
      metadata.constructorArguments.map(
        (constructorArgument: ServiceId): CreateInstanceTaskKind => ({
          id: constructorArgument,
          type: TaskKindType.createInstance,
        }),
      );

    const propertyCreateInstanceTaskKinds: CreateInstanceTaskKind[] =
      Object.values(metadata.properties).map(
        (serviceId: ServiceId): CreateInstanceTaskKind => ({
          id: serviceId,
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
