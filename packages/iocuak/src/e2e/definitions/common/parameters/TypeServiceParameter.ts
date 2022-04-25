import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { Newable } from '../../../../common/models/domain/Newable';
import { injectable } from '../../../../metadata/decorators/injectable';
import { BindingScopeApi } from '../../../../metadata/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../metadata/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../metadata/models/api/TypeBindingApi';

export interface TypeServiceParameter {
  service: Newable;
  bindingApi: TypeBindingApi;
}

function getTypeServiceParameter(): TypeServiceParameter {
  class Foo {}

  const bindingApi: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(Foo.name),
    scope: BindingScopeApi.request,
    type: Foo,
  };

  injectable({
    id: bindingApi.id,
    scope: bindingApi.scope,
  })(Foo);

  return {
    bindingApi,
    service: Foo,
  };
}

function typeServiceParameterDefinitionTransformer(
  _: string | undefined,
  serviceType: string | undefined,
): TypeServiceParameter {
  switch (serviceType) {
    case undefined:
      return getTypeServiceParameter();
    default:
      throw new Error(
        `No type service of type "${serviceType}" could be provided`,
      );
  }
}

const typeServiceParameterDefinition: IParameterTypeDefinition<TypeServiceParameter> =
  {
    name: 'typeService',
    regexp: /"type service( of type ([^"]+))?"/,
    transformer: typeServiceParameterDefinitionTransformer,
  };

defineParameterType(typeServiceParameterDefinition);
