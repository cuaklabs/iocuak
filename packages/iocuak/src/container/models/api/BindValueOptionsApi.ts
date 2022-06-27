import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface BindValueOptionsApi {
  serviceId: ServiceId;
  tags?: BindingTag | BindingTag[];
  value: unknown;
}
