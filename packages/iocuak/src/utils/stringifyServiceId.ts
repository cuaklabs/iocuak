import { ServiceId } from '../common/models/domain/ServiceId';

export function stringifyServiceId(serviceId: ServiceId): string {
  switch (typeof serviceId) {
    case 'string':
    case 'symbol':
      return serviceId.toString();
    case 'function':
      return serviceId.name;
    default:
      throw new Error(`Unexpected ${typeof serviceId} service id type`);
  }
}
