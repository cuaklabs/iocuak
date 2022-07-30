import { BindingScope } from '../models/BindingScope';

export function getDefaultBindingScope(): BindingScope {
  return BindingScope.transient;
}
