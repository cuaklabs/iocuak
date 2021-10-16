import { ServiceId } from '../../../task/models/domain/ServiceId';

export interface InjectDecoratorMetadata {
  parameters: ServiceId[];
  properties: Map<string | symbol, ServiceId>;
}
