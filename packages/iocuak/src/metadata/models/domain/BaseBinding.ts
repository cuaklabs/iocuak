import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingType } from './BindingType';

export interface BaseBinding {
  id: ServiceId;
  bindingType: BindingType;
}
