import { BindingScope } from '@cuaklabs/iocuak';
import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

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

const bindingScopeParameterDefinition: IParameterTypeDefinition<BindingScopeParameter> =
  {
    name: 'bindingScope',
    regexp: /"binding scope ([^"]+)"/,
    transformer: bindingScopeParameterDefinitionTransformer,
  };

defineParameterType(bindingScopeParameterDefinition);
