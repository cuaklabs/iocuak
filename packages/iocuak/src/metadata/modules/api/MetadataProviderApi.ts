import { MetadataServiceApiImplementation } from '../../services/api/MetadataServiceApiImplementation';

export class MetadataProviderApi extends MetadataServiceApiImplementation {
  public static build(): MetadataProviderApi {
    return new MetadataProviderApi();
  }
}
