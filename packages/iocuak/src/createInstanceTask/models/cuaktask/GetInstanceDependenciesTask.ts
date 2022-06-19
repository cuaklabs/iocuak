import { BaseTask } from '@cuaklabs/cuaktask';

import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { stringifyServiceId } from '../../../utils/stringifyServiceId';
import { GetInstanceDependenciesTaskKind } from '../domain/GetInstanceDependenciesTaskKind';
import { ServiceDependencies } from '../domain/ServiceDependencies';

export class GetInstanceDependenciesTask<
  TArgs extends unknown[] = unknown[],
> extends BaseTask<
  GetInstanceDependenciesTaskKind,
  unknown[],
  ServiceDependencies<TArgs>
> {
  protected innerPerform(
    ...dependencies: unknown[]
  ): ServiceDependencies<TArgs> {
    const serviceDependenciesArray: unknown[] =
      this.#extractServiceDependencies(dependencies);

    const constructorArguments: TArgs = this.#getConstructorArguments(
      serviceDependenciesArray,
    );

    const properties: Map<string | symbol, unknown> = this.#getProperties(
      serviceDependenciesArray,
    );

    const serviceDependencies: ServiceDependencies<TArgs> = {
      constructorArguments: constructorArguments,
      properties: properties,
    };

    return serviceDependencies;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #areValidDependenciesAmount(dependencies: unknown[]): boolean {
    const metadata: ClassMetadata = this.kind.metadata;
    const constructorArgumentsCount: number =
      metadata.constructorArguments.length;
    const propertiesCount: number = metadata.properties.size;

    return dependencies.length === constructorArgumentsCount + propertiesCount;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #extractServiceDependencies(dependencies: unknown[]): unknown[] {
    if (this.#areValidDependenciesAmount(dependencies)) {
      return dependencies;
    } else {
      throw new Error(
        `Invalid dependencies for service ${stringifyServiceId(this.kind.id)}`,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #getProperties(dependencies: unknown[]): Map<string | symbol, unknown> {
    const metadata: ClassMetadata = this.kind.metadata;
    const constructorArgumentsCount: number =
      metadata.constructorArguments.length;

    const properties: Map<string | symbol, unknown> = new Map();

    let propertiesKeyCounter: number = 0;

    for (const propertyName of metadata.properties.keys()) {
      properties.set(
        propertyName,
        dependencies[constructorArgumentsCount + propertiesKeyCounter],
      );

      ++propertiesKeyCounter;
    }

    return properties;
  }
}
