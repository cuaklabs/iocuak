import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingTypeApi } from './BindingTypeApi';

export interface BaseBindingApi {
  id: ServiceId;
  bindingType: BindingTypeApi;
}
