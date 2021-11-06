import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ClassMetadata {
  constructorArguments: ServiceId[];
  properties: Map<string | symbol, ServiceId>;
}
