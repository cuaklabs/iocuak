import { BindingScope } from '@cuaklabs/iocuak';
import { defineParameterType } from '@cucumber/cucumber';

import { BindingScopeParameter } from './BindingScopeParameter';

function bindingScopeParameterDefinitionTransformer(
  bindingScopeValue: string,
): BindingScopeParameter {
  const bindingScope: BindingScope | undefined = (
    Object.values(BindingScope) as BindingScope[]
  ).find(
    (bindingScope: BindingScope): boolean =>
      (bindingScopeValue as BindingScope) === bindingScope,
  );

  if (bindingScope === undefined) {
    throw new Error(`Invalid binding scope "${bindingScopeValue}"`);
  }

  return {
    scope: bindingScope,
  };
}

defineParameterType({
  name: 'bindingScope',
  regexp: /"binding scope ([^"]+)"/,
  transformer: bindingScopeParameterDefinitionTransformer,
});
