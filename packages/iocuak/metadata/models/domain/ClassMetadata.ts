import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ClassMetadata {
  constructorArguments: ServiceId[];
  properties: Map<string | symbol, ServiceId>;
}
