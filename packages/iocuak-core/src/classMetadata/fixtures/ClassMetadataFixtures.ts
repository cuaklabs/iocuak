import {
  ClassElementMetadataType,
  ClassMetadata,
} from '@cuaklabs/iocuak-models';

export class ClassMetadataFixtures {
  public static get any(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      properties: new Map(),
    };

    return fixture;
  }

  public static get withConstructorArgumentsServiceAndPropertiesService(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [
        {
          type: ClassElementMetadataType.serviceId,
          value: 'sample-constructor-dependency-id',
        },
      ],
      properties: new Map([
        [
          'sampleProperty',
          {
            type: ClassElementMetadataType.serviceId,
            value: 'sample-property-dependency-id',
          },
        ],
      ]),
    };

    return fixture;
  }

  public static get withConstructorArgumentsOneServiceAndPropertiesEmpty(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [
        {
          type: ClassElementMetadataType.serviceId,
          value: 'sample-constructor-dependency-id',
        },
      ],
      properties: new Map(),
    };

    return fixture;
  }

  public static get withConstructorArgumentsOneTagAndPropertiesEmpty(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [
        {
          type: ClassElementMetadataType.tag,
          value: Symbol(),
        },
      ],
      properties: new Map(),
    };

    return fixture;
  }

  public static get withConstructorArgumentsEmptyAndPropertiesOneService(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      properties: new Map([
        [
          'sampleProperty',
          {
            type: ClassElementMetadataType.serviceId,
            value: 'sample-property-dependency-id',
          },
        ],
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
