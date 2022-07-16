import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { getValueServiceParameter } from './getValueServiceParameter';
import { ValueServiceParameter } from './ValueServiceParameter';

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
