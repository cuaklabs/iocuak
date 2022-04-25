import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { BindingTypeApi } from '../../../../metadata/models/api/BindingTypeApi';
import { ValueBindingApi } from '../../../../metadata/models/api/ValueBindingApi';

export interface ValueServiceParameter {
  bindingApi: ValueBindingApi;
  service: unknown;
}

function getValueServiceParameter(): ValueServiceParameter {
  const value: unknown = Symbol('value');

  const bindingApi: ValueBindingApi = {
    bindingType: BindingTypeApi.value,
    id: Symbol('value-service'),
    value,
  };

  return {
    bindingApi,
    service: value,
  };
}

function valueServiceParameterDefinitionTransformer(): ValueServiceParameter {
  return getValueServiceParameter();
}

const valueServiceParameterDefinition: IParameterTypeDefinition<ValueServiceParameter> =
  {
    name: 'valueService',
    regexp: /"value service"/,
    transformer: valueServiceParameterDefinitionTransformer,
  };

defineParameterType(valueServiceParameterDefinition);
