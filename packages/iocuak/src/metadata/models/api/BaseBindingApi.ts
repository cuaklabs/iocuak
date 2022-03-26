import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingApiType } from './BindingApiType';

export interface BaseBindingApi {
  id: ServiceId;
  bindingType: BindingApiType;
}
