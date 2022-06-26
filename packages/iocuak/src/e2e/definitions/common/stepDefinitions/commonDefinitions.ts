import { Given, Then } from '@cucumber/cucumber';
import chai from 'chai';

import { ResultWorld } from '../models/worlds/ResultWorld';
import { TagWorld } from '../models/worlds/TagWorld';
import { TwoResultsWorld } from '../models/worlds/TwoResultsWorld';
import { TypeServiceWorld } from '../models/worlds/TypeServiceWorld';
import { ValueServiceWorld } from '../models/worlds/ValueServiceWorld';
import { TypeServiceParameter } from '../parameters/typeService/TypeServiceParameter';
import { ValueServiceParameter } from '../parameters/valueService/ValueServiceParameter';

Given<TagWorld>('a tag', function (): void {
  this.tag = Symbol();
});

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

Then<ResultWorld>(
  'an error containing "{}" is thrown',
  function (errorContent: string) {
    chai.expect(this.error).to.be.instanceOf(Error);
    chai.expect((this.error as Error).message).to.contain(errorContent);
  },
);

Then<TwoResultsWorld>(
  'both first and second {} are the same one',
  function (_: string): void {
    chai.expect(this.result).to.equal(this.secondResult);
  },
);

Then<TwoResultsWorld>(
  'both first and second {} are not the same one',
  function (_: string): void {
    chai.expect(this.result).to.not.equal(this.secondResult);
  },
);

Then<ResultWorld>('no errors are thrown', function () {
  chai.expect(this.error).to.be.equal(undefined);
});
