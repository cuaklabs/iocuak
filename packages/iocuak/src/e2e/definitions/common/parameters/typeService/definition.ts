import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { getTypeServiceWithBindingWithRequestScope } from './getTypeServiceWithBindingWithRequestScope';
import { getTypeServiceWithBindingWithSingletonScope } from './getTypeServiceWithBindingWithSingletonScope';
import { getTypeServiceWithBindingWithTransientScope } from './getTypeServiceWithBindingWithTransientScope';
import { getTypeServiceWithConstructorParameters } from './getTypeServiceWithConstructorParameters';
import { getTypeServiceWithNoDependenciesParameter } from './getTypeServiceWithNoDependenciesParameter';
import { getTypeServiceWithProperties } from './getTypeServiceWithProperties';
import { TypeServiceParameter } from './TypeServiceParameter';

function typeServiceParameterDefinitionTransformer(
  serviceType: string | undefined,
): TypeServiceParameter {
  switch (serviceType) {
    case undefined:
    case 'no dependencies':
      return getTypeServiceWithNoDependenciesParameter();
    case 'binding with request scope':
      return getTypeServiceWithBindingWithRequestScope();
    case 'binding with singleton scope':
      return getTypeServiceWithBindingWithSingletonScope();
    case 'binding with transient scope':
      return getTypeServiceWithBindingWithTransientScope();
    case 'constructor parameters':
      return getTypeServiceWithConstructorParameters();
    case 'properties':
      return getTypeServiceWithProperties();
    default:
      throw new Error(
        `No type service of type "${serviceType}" could be provided`,
      );
  }
}

const typeServiceParameterDefinition: IParameterTypeDefinition<TypeServiceParameter> =
  {
    name: 'typeService',
    regexp: /"type service(?: (?:with) ([^"]+))?"/,
    transformer: typeServiceParameterDefinitionTransformer,
  };

defineParameterType(typeServiceParameterDefinition);
