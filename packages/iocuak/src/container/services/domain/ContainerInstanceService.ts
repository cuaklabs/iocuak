import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { ServiceId } from '../../../common/models/domain/ServiceId';

export interface ContainerInstanceService {
  create<TInstance>(serviceId: ServiceId): TInstance;
  createByTag<TInstances extends unknown[] = unknown[]>(
    tag: BindingTag,
  ): TInstances;
}
