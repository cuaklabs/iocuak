import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerInstanceServiceApi {
  get<TInstance>(serviceId: ServiceId): TInstance;
  getByTag<TInstances extends unknown[] = unknown[]>(
    tag: BindingTag,
  ): TInstances;
}
