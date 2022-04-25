import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

import { ContainerApi } from '../../../container/modules/api/ContainerApi';
import { ContainerBindingGetMetadataWorld } from './models/worlds/ContainerBindingGetMetadataWorld';
import { ContainerBindingGetTypeMetadataWorld } from './models/worlds/ContainerBindingGetTypeMetadataWorld';
import { ContainerBindingGetValueMetadataWorld } from './models/worlds/ContainerBindingGetValueMetadataWorld';
import { ContainerWorld } from './models/worlds/ContainerWorld';

Given<ContainerWorld>('a container', function () {
  this.container = ContainerApi.build();
});

When<ContainerBindingGetTypeMetadataWorld>(
  'the type service is bound',
  function () {
    this.container.bind(this.typeService);
  },
);

When<ContainerBindingGetValueMetadataWorld>(
  'the value service is bound',
  function () {
    this.container.bindToValue(this.valueServiceBinding.id, this.valueService);
  },
);

When<ContainerBindingGetMetadataWorld>(
  'container metadata is requested',
  function () {
    this.result = this.container.getAllBindinds();
  },
);

Then<ContainerBindingGetTypeMetadataWorld>(
  'type service metadata is included in the result',
  function () {
    expect(this.result).to.deep.include(this.typeServiceBinding);
  },
);

Then<ContainerBindingGetValueMetadataWorld>(
  'value service metadata is included in the result',
  function () {
    expect(this.result).to.deep.include(this.valueServiceBinding);
  },
);
