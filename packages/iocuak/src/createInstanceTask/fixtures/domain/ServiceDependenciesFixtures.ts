import { ServiceDependencies } from '../../models/domain/ServiceDependencies';

export class ServiceDependenciesFixtures {
  public static get withConstructorArgumentsEmptyAndPropertiesEmpty(): ServiceDependencies<
    []
  > {
    const fixture: ServiceDependencies<[]> = {
      constructorArguments: [],
      properties: new Map(),
    };

    return fixture;
  }

  public static get withConstructorArgumentsAndProperties(): ServiceDependencies<
    [string]
  > {
    const fixture: ServiceDependencies<[string]> = {
      constructorArguments: ['sample-string-argument'],
      properties: new Map([['fooProperty', 'foo-value']]),
    };

    return fixture;
  }
}
