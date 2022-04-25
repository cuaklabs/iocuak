import { Given } from '@cucumber/cucumber';

import { TypeServiceWorld } from '../models/worlds/TypeServiceWorld';
import { ValueServiceWorld } from '../models/worlds/ValueServiceWorld';
import { TypeServiceParameter } from '../parameters/TypeServiceParameter';
import { ValueServiceParameter } from '../parameters/ValueServiceParameter';

Given<TypeServiceWorld>(
  'a {typeService}',
  function (typeServiceParameter: TypeServiceParameter) {
    this.typeServiceBinding = typeServiceParameter.bindingApi;
    this.typeService = typeServiceParameter.service;
  },
);

Given<ValueServiceWorld>(
  'a {valueService}',
  function (valueServiceParameter: ValueServiceParameter) {
    this.valueService = valueServiceParameter.service;
    this.valueServiceBinding = valueServiceParameter.bindingApi;
  },
);
