import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingScopeApi } from './BindingScopeApi';

export interface InjectableOptionsApi {
  id?: ServiceId;
  scope?: BindingScopeApi;
}
