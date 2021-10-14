import { ClassMetadata } from '../../models/domain/ClassMetadata';

export class ClassMetadataFixtures {
  public static get any(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      properties: {},
    };

    return fixture;
  }

  public static get withConstructorArgumentsAndProperties(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: ['sample-constructor-dependency-id'],
      properties: {
        sampleProperty: 'sample-property-dependency-id',
      },
    };

    return fixture;
  }

  public static get withConstructorArgumentsAndPropertiesEmpty(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: ['sample-constructor-dependency-id'],
      properties: {},
    };

    return fixture;
  }

  public static get withConstructorArgumentsEmptyAndProperties(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      properties: {
        sampleProperty: 'sample-property-dependency-id',
      },
    };

    return fixture;
  }

  public static get withConstructorArgumentsEmptyAndPropertiesEmpty(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      properties: {},
    };

    return fixture;
  }
}
