import { ClassElementMetadatApiType } from '../../models/api/ClassElementMetadatApiType';
import { ClassElementServiceIdMetadataApi } from '../../models/api/ClassElementServiceIdMetadataApi';
import { ClassElementTagMetadataApi } from '../../models/api/ClassElementTagMetadataApi';

export class ClassElementMetadataApiFixtures {
  public static get withTypeServiceId(): ClassElementServiceIdMetadataApi {
    const fixture: ClassElementServiceIdMetadataApi = {
      type: ClassElementMetadatApiType.serviceId,
      value: 'service-id',
    };

    return fixture;
  }

  public static get withTypeTag(): ClassElementTagMetadataApi {
    const fixture: ClassElementTagMetadataApi = {
      type: ClassElementMetadatApiType.tag,
      value: 'service-tag',
    };

    return fixture;
  }
}
