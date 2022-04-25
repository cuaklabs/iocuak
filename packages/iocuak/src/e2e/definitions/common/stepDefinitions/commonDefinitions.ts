import { Given } from '@cucumber/cucumber';

import { TypeServiceWorld } from '../models/worlds/TypeServiceWorld';
import { ValueServiceWorld } from '../models/worlds/ValueServiceWorld';
import { TypeServiceParameter } from '../parameters/typeService/TypeServiceParameter';
import { ValueServiceParameter } from '../parameters/ValueServiceParameter';

Given<TypeServiceWorld>(
  'a {typeService}',
  function (typeServiceParameter: TypeServiceParameter): void {
    this.typeServiceParameter = typeServiceParameter;
  },
);

Given<ValueServiceWorld>(
  'a {valueService}',
  function (valueServiceParameter: ValueServiceParameter): void {
    this.valueServiceParameter = valueServiceParameter;
  },
);
