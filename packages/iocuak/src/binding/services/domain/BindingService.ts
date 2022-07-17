import { ServiceId } from '@cuaklabs/iocuak-common';

import { Binding } from '../../models/domain/Binding';
import { BindingTag } from '../../models/domain/BindingTag';

export interface BindingService {
  get<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
  ): Binding<TInstance, TArgs> | undefined;

  getByTag(tag: BindingTag, removeDuplicates: boolean): Iterable<Binding>;

  getAll(): Map<ServiceId, Binding>;

  remove(serviceId: ServiceId): void;

  set<TInstance, TArgs extends unknown[]>(
    binding: Binding<TInstance, TArgs>,
  ): void;
}
