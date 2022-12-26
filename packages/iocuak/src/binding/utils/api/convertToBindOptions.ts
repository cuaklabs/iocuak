import { BindingScope, BindOptions } from '@cuaklabs/iocuak-models';
import {
  bindingScopeApiToBindingScopeMap,
  BindOptionsApi,
} from '@cuaklabs/iocuak-models-api';

export function convertToBindOptions(options: BindOptionsApi): BindOptions {
  let bindingScope: BindingScope | undefined;

  if (options.scope === undefined) {
    bindingScope = undefined;
  } else {
    bindingScope = bindingScopeApiToBindingScopeMap[options.scope];
  }

  const bindOptions: BindOptions = {
    scope: bindingScope,
  };

  return bindOptions;
}
