import { ClassMetadataFixtures } from '../../../classMetadata/fixtures/domain/ClassMetadataFixtures';
import { GetInstanceDependenciesTaskKind } from '../../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class GetInstanceDependenciesTaskKindFixtures {
  public static get any(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      id: 'get-instance-dependencies-task-sample-id',
      metadata: ClassMetadataFixtures.any,
      type: TaskKindType.getInstanceDependencies,
    };

    return fixture;
  }

  public static get withMetadataWithConstructorArgumentsAndProperties(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      ...GetInstanceDependenciesTaskKindFixtures.any,
      metadata:
        ClassMetadataFixtures.withConstructorArgumentsServiceAndPropertiesService,
    };

    return fixture;
  }

  public static get withMetadataWithConstructorArgumentsEmptyAndPropertiesEmpty(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      ...GetInstanceDependenciesTaskKindFixtures.any,
      metadata:
        ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
    };

    return fixture;
  }

  public static get withMetadataWithConstructorArgumentsEmptyAndProperties(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      ...GetInstanceDependenciesTaskKindFixtures.any,
      metadata:
        ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesOneService,
    };

    return fixture;
  }

  public static get withMetadataWithConstructorArgumentsOneAndPropertiesEmpty(): GetInstanceDependenciesTaskKind {
    const fixture: GetInstanceDependenciesTaskKind = {
      ...GetInstanceDependenciesTaskKindFixtures.any,
      metadata:
        ClassMetadataFixtures.withConstructorArgumentsOneServiceAndPropertiesEmpty,
    };

    return fixture;
  }
}
