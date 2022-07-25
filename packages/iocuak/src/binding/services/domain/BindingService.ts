import { Binding } from '@cuaklabs/iocuak-binding';
import { ServiceId, Tag } from '@cuaklabs/iocuak-common';

export interface BindingService {
  get<TInstance, TArgs extends unknown[]>(
    serviceId: ServiceId,
  ): Binding<TInstance, TArgs> | undefined;

  getByTag(tag: Tag, removeDuplicates: boolean): Iterable<Binding>;

  getAll(): Map<ServiceId, Binding>;

  remove(serviceId: ServiceId): void;

  set<TInstance, TArgs extends unknown[]>(
    binding: Binding<TInstance, TArgs>,
  ): void;
}
