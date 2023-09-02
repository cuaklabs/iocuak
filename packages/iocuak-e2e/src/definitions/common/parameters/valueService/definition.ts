import { defineParameterType } from '@cucumber/cucumber';

import { getValueServiceParameter } from './getValueServiceParameter';
import { ValueServiceParameter } from './ValueServiceParameter';

function valueServiceParameterDefinitionTransformer(): ValueServiceParameter {
  return getValueServiceParameter();
}

defineParameterType({
  name: 'valueService',
  regexp: /"value service"/,
  transformer: valueServiceParameterDefinitionTransformer,
});
