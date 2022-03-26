import { MetadataServiceApiImplementation } from '../services/api/MetadataServiceApiImplementation';
import { MetadataService } from '../services/domain/MetadataService';
import { MetadataServiceImplementation } from '../services/domain/MetadataServiceImplementation';

export class MetadataProviderApi extends MetadataServiceApiImplementation {
  private constructor() {
    const metadataService: MetadataService =
      new MetadataServiceImplementation();

    super(metadataService);
  }

  public static build(): MetadataProviderApi {
    return new MetadataProviderApi();
  }
}
