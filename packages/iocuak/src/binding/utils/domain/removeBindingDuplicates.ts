import { ServiceId } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

export function removeBindingDuplicates(
  bindings: Iterable<Binding>,
): Iterable<Binding> {
  const bindingIdBindingTuples: [ServiceId, Binding][] = [];

  for (const binding of bindings) {
    bindingIdBindingTuples.push([binding.id, binding]);
  }

  const serviceIdToBindingMap: Map<ServiceId, Binding> = new Map(
    bindingIdBindingTuples,
  );

  return serviceIdToBindingMap.values();
}
