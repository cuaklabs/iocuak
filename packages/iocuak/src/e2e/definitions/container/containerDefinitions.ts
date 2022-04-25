import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

import { ContainerApi } from '../../../container/modules/api/ContainerApi';
import { ResultWorld } from '../common/models/worlds/ResultWorld';
import { TypeServiceWorld } from '../common/models/worlds/TypeServiceWorld';
import { ValueServiceWorld } from '../common/models/worlds/ValueServiceWorld';
import { ContainerWorld } from './models/worlds/ContainerWorld';

Given<ContainerWorld>('a container', function () {
  this.container = ContainerApi.build();
});

When<ContainerWorld & TypeServiceWorld>(
  'the type service is bound',
  function () {
    this.container.bind(this.typeService);
  },
);

When<ContainerWorld & ValueServiceWorld>(
  'the value service is bound',
  function () {
    this.container.bindToValue(this.valueServiceBinding.id, this.valueService);
  },
);

When<ContainerWorld & ResultWorld>(
  'container metadata is requested',
  function () {
    this.result = this.container.getAllBindinds();
  },
);

Then<TypeServiceWorld & ResultWorld>(
  'type service metadata is included in the result',
  function () {
    expect(this.result).to.deep.include(this.typeServiceBinding);
  },
);

Then<ValueServiceWorld & ResultWorld>(
  'value service metadata is included in the result',
  function () {
    expect(this.result).to.deep.include(this.valueServiceBinding);
  },
);
