import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { getTypeServiceWithBindingWithRequestScope } from './getTypeServiceWithBindingWithRequestScope';
import { getTypeServiceWithBindingWithSingletonScope } from './getTypeServiceWithBindingWithSingletonScope';
import { getTypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope } from './getTypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope';
import { getTypeServiceWithBindingWithTransientScope } from './getTypeServiceWithBindingWithTransientScope';
import { getTypeServiceWithConstructorParameters } from './getTypeServiceWithConstructorParameters';
import { getTypeServiceWithNoBinding } from './getTypeServiceWithNoBindingParameter';
import { getTypeServiceWithNoDependenciesParameter } from './getTypeServiceWithNoDependenciesParameter';
import { getTypeServiceWithProperties } from './getTypeServiceWithProperties';
import { getTypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope } from './getTypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope';
import { getTypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope } from './getTypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope';
import { getTypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope } from './getTypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope';
import { getTypeServiceWithTypeServiceId } from './getTypeServiceWithTypeServiceId';
import { getTypeServiceWithUnboundClassTypeServiceConstructorParameters } from './getTypeServiceWithUnboundClassTypeServiceConstructorParameters';
import { getTypeServiceWithUnboundClassTypeServiceProperties } from './getTypeServiceWithUnboundClassTypeServiceProperties';
import { TypeServiceParameter } from './TypeServiceParameter';

function typeServiceParameterDefinitionTransformer(
  serviceType: string | undefined,
): TypeServiceParameter {
  switch (serviceType) {
    case 'type service id':
      return getTypeServiceWithTypeServiceId();
    case undefined:
    case 'any binding':
    case 'no dependencies':
      return getTypeServiceWithNoDependenciesParameter();
    case 'binding with request scope':
      return getTypeServiceWithBindingWithRequestScope();
    case 'binding with singleton scope':
      return getTypeServiceWithBindingWithSingletonScope();
    case 'binding with singleton scope and dependencies with transient scope':
      return getTypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope();
    case 'binding with transient scope':
      return getTypeServiceWithBindingWithTransientScope();
    case 'constructor parameters':
      return getTypeServiceWithConstructorParameters();
    case 'no binding':
      return getTypeServiceWithNoBinding();
    case 'properties':
      return getTypeServiceWithProperties();
    case 'two dependencies of the same type with request scope':
      return getTypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope();
    case 'two dependencies of the same type with singleton scope':
      return getTypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope();
    case 'two dependencies of the same type with transient scope':
      return getTypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope();
    case 'unbound class type service constructor parameters':
      return getTypeServiceWithUnboundClassTypeServiceConstructorParameters();
    case 'unbound class type service properties':
      return getTypeServiceWithUnboundClassTypeServiceProperties();
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
