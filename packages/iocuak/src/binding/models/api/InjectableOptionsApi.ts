import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingTag } from '../domain/BindingTag';
import { BindingScopeApi } from './BindingScopeApi';

export interface InjectableOptionsApi {
  id?: ServiceId;
  scope?: BindingScopeApi;
  tags?: BindingTag | BindingTag[];
}
