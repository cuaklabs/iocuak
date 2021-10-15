import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface ClassMetadata {
  constructorArguments: ServiceId[];
  properties: Record<string, ServiceId>;
}
