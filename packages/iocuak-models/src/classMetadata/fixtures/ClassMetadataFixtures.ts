import { ClassElementMetadataType } from '../models/ClassElementMetadataType';
import { ClassMetadata } from '../models/ClassMetadata';

export class ClassMetadataFixtures {
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
}
