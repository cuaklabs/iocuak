import { ClassMetadataFixtures } from '../../metadata/fixtures/ClassMetadataFixtures';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class GetInstanceDependenciesTaskKindFixtures {
  public static get any(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      id: 'get-instance-dependencies-task-sample-id',
      metadata: ClassMetadataFixtures.any,
      type: TaskKindType.getInstanceDependencies,
    };

    return fixture;
  }

  public static get withMetadataWithConstructorArgumentsEmptyAndPropertiesEmpty(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      id: 'get-instance-dependencies-task-sample-id',
      metadata:
        ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
      type: TaskKindType.getInstanceDependencies,
    };

    return fixture;
  }

  public static get withMetadataWithConstructorArgumentsEmptyAndProperties(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      id: 'get-instance-dependencies-task-sample-id',
      metadata:
        ClassMetadataFixtures.withConstructorArgumentsEmptyAndProperties,
      type: TaskKindType.getInstanceDependencies,
    };

    return fixture;
  }

  public static get withMetadataWithConstructorArgumentsAndPropertiesEmpty(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      id: 'get-instance-dependencies-task-sample-id',
      metadata:
        ClassMetadataFixtures.withConstructorArgumentsAndPropertiesEmpty,
      type: TaskKindType.getInstanceDependencies,
    };

    return fixture;
  }
}
