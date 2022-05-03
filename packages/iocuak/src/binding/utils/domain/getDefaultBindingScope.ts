import { BindingScope } from '../../models/domain/BindingScope';

export function getDefaultBindingScope(): BindingScope {
  return BindingScope.transient;
}
