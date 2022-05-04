import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingTag } from './BindingTag';
import { BindingType } from './BindingType';

export interface BaseBinding {
  id: ServiceId;
  bindingType: BindingType;
  tags: BindingTag[];
}
