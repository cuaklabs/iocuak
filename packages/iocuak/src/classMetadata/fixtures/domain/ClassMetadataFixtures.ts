import { ClassMetadata } from '../../models/domain/ClassMetadata';

export class ClassMetadataFixtures {
  public static get any(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      properties: new Map(),
    };

    return fixture;
  }

  public static get withConstructorArgumentsAndProperties(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: ['sample-constructor-dependency-id'],
      properties: new Map([
        ['sampleProperty', 'sample-property-dependency-id'],
      ]),
    };

    return fixture;
  }

  public static get withConstructorArgumentsOneAndPropertiesEmpty(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: ['sample-constructor-dependency-id'],
      properties: new Map(),
    };

    return fixture;
  }

  public static get withConstructorArgumentsEmptyAndPropertiesOne(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      properties: new Map([
        ['sampleProperty', 'sample-property-dependency-id'],
      ]),
    };

    return fixture;
  }

  public static get withConstructorArgumentsEmptyAndPropertiesEmpty(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      properties: new Map(),
    };

    return fixture;
  }
}
