import { BindingScope } from '@cuaklabs/iocuak-binding';

export function getDefaultBindingScope(): BindingScope {
  return BindingScope.transient;
}
