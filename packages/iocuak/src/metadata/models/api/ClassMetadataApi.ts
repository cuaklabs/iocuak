import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ClassMetadataApi {
  constructorArguments: ServiceId[];
  properties: Map<string | symbol, ServiceId>;
}
