import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { ContainerModuleParameter } from './ContainerModuleParameter';
import { getContainerModuleWithTypeServiceAndValueServiceParameter } from './getContainerModuleWithTypeServiceAndValueServiceParameter';

function containerModuleParameterDefinitionTransformer(
  containerModuleType: string,
): ContainerModuleParameter {
  switch (containerModuleType) {
    case 'a type service and a value service':
      return getContainerModuleWithTypeServiceAndValueServiceParameter();
    default:
      throw new Error(
        `No container module of type "${containerModuleType}" could be provided`,
      );
  }
}

const containerModuleParameterDefinition: IParameterTypeDefinition<ContainerModuleParameter> =
  {
    name: 'containerModule',
    regexp: /"container module(?: (?:with) ([^"]+))?"/,
    transformer: containerModuleParameterDefinitionTransformer,
  };

defineParameterType(containerModuleParameterDefinition);
