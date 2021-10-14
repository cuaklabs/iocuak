import { BaseDependentTask } from '@cuaklabs/cuaktask';

import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { stringifyTaskId } from '../../../utils/stringifyTaskId';
import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { ServiceDependencies } from '../domain/ServiceDependencies';
import { TaskKind } from '../domain/TaskKind';

export class GetInstanceDependenciesTask<
  TArgs extends unknown[] = unknown[],
> extends BaseDependentTask<
  GetInstanceDependenciesTaskKind,
  TaskKind,
  unknown[],
  ServiceDependencies<TArgs>
> {
  protected innerPerform(
    ...dependencies: unknown[]
  ): ServiceDependencies<TArgs> {
    if (this.#areValidDependencies(dependencies)) {
      const constructorArguments: TArgs =
        this.#getConstructorArguments(dependencies);

      const properties: Record<string, unknown> =
        this.#getProperties(dependencies);

      const serviceDependencies: ServiceDependencies<TArgs> = {
        constructorArguments: constructorArguments,
        properties: properties,
      };

      return serviceDependencies;
    } else {
      throw new Error(
        `Invalid dependencies for service ${stringifyTaskId(this.kind.id)}`,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/member-ordering
  #areValidDependencies(dependencies: unknown[]): boolean {
    const metadata: ClassMetadata = this.kind.metadata;
    const constructorArgumentsCount: number =
      metadata.constructorArguments.length;
    const propertiesCount: number = Object.keys(metadata.properties).length;

    return dependencies.length === constructorArgumentsCount + propertiesCount;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/member-ordering
  #getConstructorArguments(dependencies: unknown[]): TArgs {
    const metadata: ClassMetadata = this.kind.metadata;
    const constructorArgumentsCount: number =
      metadata.constructorArguments.length;

    const constructorArguments: TArgs = dependencies.slice(
      0,
      constructorArgumentsCount,
    ) as TArgs;

    return constructorArguments;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/member-ordering
  #getProperties(dependencies: unknown[]): Record<string, unknown> {
    const metadata: ClassMetadata = this.kind.metadata;
    const constructorArgumentsCount: number =
      metadata.constructorArguments.length;

    const properties: Record<string, unknown> = {};

    let propertiesKeyCounter: number = 0;

    for (const propertyName in metadata.properties) {
      properties[propertyName] =
        dependencies[constructorArgumentsCount + propertiesKeyCounter];

      ++propertiesKeyCounter;
    }

    return properties;
  }
}
