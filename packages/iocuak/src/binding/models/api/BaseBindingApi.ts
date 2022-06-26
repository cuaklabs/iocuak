import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingTag } from '../domain/BindingTag';
import { BindingTypeApi } from './BindingTypeApi';

export interface BaseBindingApi {
  id: ServiceId;
  bindingType: BindingTypeApi;
  tags: BindingTag[];
}
