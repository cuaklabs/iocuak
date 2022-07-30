import { BindingScope } from '@cuaklabs/iocuak-models';

export function getDefaultBindingScope(): BindingScope {
  return BindingScope.transient;
}
