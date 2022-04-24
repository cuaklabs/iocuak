import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerApi } from '../../../container/modules/api/ContainerApi';
import { injectable } from '../../../metadata/decorators/injectable';
import { BindingScopeApi } from '../../../metadata/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../metadata/models/api/BindingTypeApi';
import { ContainerBindingGetMetadataWorld } from './models/worlds/ContainerBindingGetMetadataWorld';
import { ContainerBindingGetTypeMetadataWorld } from './models/worlds/ContainerBindingGetTypeMetadataWorld';
import { ContainerBindingGetValueMetadataWorld } from './models/worlds/ContainerBindingGetValueMetadataWorld';
import { ContainerWorld } from './models/worlds/ContainerWorld';

Given<ContainerWorld>('a container', function () {
  this.container = ContainerApi.build();
});

Given<ContainerBindingGetTypeMetadataWorld>('a type service', function () {
  const serviceId: ServiceId = Symbol('Foo');
  const scope: BindingScopeApi = BindingScopeApi.request;

  @injectable({
    id: serviceId,
    scope,
  })
  class Foo {}

  this.expectedBinding = {
    bindingType: BindingTypeApi.type,
    id: serviceId,
    scope,
    type: Foo,
  };

  this.typeService = Foo;
});

Given<ContainerBindingGetValueMetadataWorld>('a value service', function () {
  const serviceId: ServiceId = Symbol('Foo');
  const value: unknown = Symbol('value');

  this.expectedBinding = {
    bindingType: BindingTypeApi.value,
    id: serviceId,
    value,
  };

  this.serviceId = serviceId;
  this.valueService = value;
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
    this.container.bindToValue(this.serviceId, this.valueService);
  },
);

When<ContainerBindingGetMetadataWorld>(
  'container metadata is requested',
  function () {
    this.result = this.container.getAllBindinds();
  },
);

Then<ContainerBindingGetMetadataWorld>(
  'service metadata is included in the result',
  function () {
    expect(this.result).to.deep.include(this.expectedBinding);
  },
);
