import { Given } from '@cucumber/cucumber';

import { TypeServiceWorld } from '../models/worlds/TypeServiceWorld';
import { ValueServiceWorld } from '../models/worlds/ValueServiceWorld';
import { TypeServiceParameter } from '../parameters/typeService/TypeServiceParameter';
import { ValueServiceParameter } from '../parameters/ValueServiceParameter';

Given<TypeServiceWorld>(
  'a {typeService}',
  function (typeServiceParameter: TypeServiceParameter): void {
    this.typeServiceBinding = typeServiceParameter.bindingApi;
    this.typeService = typeServiceParameter.service;
    this.typeServiceSpy = typeServiceParameter.spy;
  },
);

Given<ValueServiceWorld>(
  'a {valueService}',
  function (valueServiceParameter: ValueServiceParameter): void {
    this.valueService = valueServiceParameter.service;
    this.valueServiceBinding = valueServiceParameter.bindingApi;
  },
);
