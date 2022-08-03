import {
  ClassElementMetadataApiType,
  ClassElementServiceIdMetadataApi,
  ClassElementTagMetadataApi,
} from '@cuaklabs/iocuak-models-api';

export class ClassElementMetadataApiFixtures {
  public static get withTypeServiceId(): ClassElementServiceIdMetadataApi {
    const fixture: ClassElementServiceIdMetadataApi = {
      type: ClassElementMetadataApiType.serviceId,
      value: 'service-id',
    };

    return fixture;
  }

  public static get withTypeTag(): ClassElementTagMetadataApi {
    const fixture: ClassElementTagMetadataApi = {
      type: ClassElementMetadataApiType.tag,
      value: 'service-tag',
    };

    return fixture;
  }
}
