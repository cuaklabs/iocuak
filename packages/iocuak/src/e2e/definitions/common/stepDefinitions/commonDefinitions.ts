import { Given, Then } from '@cucumber/cucumber';
import chai from 'chai';

import { ResultWorld } from '../models/worlds/ResultWorld';
import { TypeServiceWorld } from '../models/worlds/TypeServiceWorld';
import { ValueServiceWorld } from '../models/worlds/ValueServiceWorld';
import { TypeServiceParameter } from '../parameters/typeService/TypeServiceParameter';
import { ValueServiceParameter } from '../parameters/valueService/ValueServiceParameter';

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

Then<ResultWorld>('an error is thrown', function () {
  chai.expect(this.error).not.to.be.equal(undefined);
});

Then<ResultWorld>('no errors are thrown', function () {
  chai.expect(this.error).to.be.equal(undefined);
});
