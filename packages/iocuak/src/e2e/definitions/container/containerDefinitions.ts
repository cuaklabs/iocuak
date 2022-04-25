import { Given, When, Then } from '@cucumber/cucumber';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerApi } from '../../../container/modules/api/ContainerApi';
import { BindingApi } from '../../../metadata/models/api/BindingApi';
import { BindingTypeApi } from '../../../metadata/models/api/BindingTypeApi';
import { ClassMetadataApi } from '../../../metadata/models/api/ClassMetadataApi';
import { MetadataProviderApi } from '../../../metadata/modules/MetadataProviderApi';
import { ResultWorld } from '../common/models/worlds/ResultWorld';
import { TypeServiceWorld } from '../common/models/worlds/TypeServiceWorld';
import { ValueServiceWorld } from '../common/models/worlds/ValueServiceWorld';
import { TypeServiceParameter } from '../common/parameters/typeService/TypeServiceParameter';
import { ValueServiceParameter } from '../common/parameters/ValueServiceParameter';
import { ContainerWorld } from './models/worlds/ContainerWorld';

chai.use(sinonChai);

function bindServiceDependencies(
  this: ContainerWorld,
  typeServiceParameter: TypeServiceParameter,
): void {
  if (typeServiceParameter.dependencies !== undefined) {
    for (const dependency of typeServiceParameter.dependencies) {
      switch (dependency.binding.bindingType) {
        case BindingTypeApi.type:
          bindServiceDependencies.bind(this)(
            dependency as TypeServiceParameter,
          );

          this.container.bind((dependency as TypeServiceParameter).service);

          break;
        case BindingTypeApi.value:
          this.container.bindToValue(
            dependency.binding.id,
            (dependency as ValueServiceParameter).binding.value,
          );
          break;
      }
    }
  }
}

function bindingToSinonMatcher(
  binding: BindingApi | undefined,
  index: number,
): sinon.SinonMatcher {
  let match: sinon.SinonMatcher;
  if (binding === undefined) {
    // eslint-disable-next-line import/no-named-as-default-member
    match = sinon.match(
      `No metatada found constructor argument at position ${index}`,
    );
  } else {
    switch (binding.bindingType) {
      case BindingTypeApi.type:
        // eslint-disable-next-line import/no-named-as-default-member
        match = sinon.match.instanceOf(binding.type);
        break;
      case BindingTypeApi.value:
        // eslint-disable-next-line import/no-named-as-default-member
        match = sinon.match(binding.value as object);
        break;
    }
  }

  return match;
}

function getBinding(
  this: ContainerWorld,
  serviceId: ServiceId,
): BindingApi | undefined {
  const containerBindings: BindingApi[] = this.container.getAllBindinds();
  const metadataProvider: MetadataProviderApi = MetadataProviderApi.build();

  return (
    containerBindings.find((binding: BindingApi) => binding.id === serviceId) ??
    (typeof serviceId === 'function'
      ? metadataProvider.getBindingMetadata(serviceId)
      : undefined)
  );
}

function propertyBindingToChaiAssertionInvocation(
  result: unknown,
  propertyName: string | symbol,
  binding: BindingApi | undefined,
): void {
  if (binding === undefined) {
    chai.assert.fail(
      `No metatada found for property ${propertyName.toString()}`,
    );
  } else {
    chai.expect(result).to.haveOwnProperty(propertyName);

    const propertyAssertion: Chai.Assertion = chai.expect(
      (result as Record<string | symbol, unknown>)[propertyName],
    );

    switch (binding.bindingType) {
      case BindingTypeApi.type:
        propertyAssertion.to.be.instanceOf(binding.type);
        break;
      case BindingTypeApi.value:
        propertyAssertion.to.be.equal(binding.value);
        break;
    }
  }
}

Given<ContainerWorld>('a container', function (): void {
  this.container = ContainerApi.build();
});

When<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'an instace of the type service is requested',
  function (): void {
    this.result = this.container.get(this.typeServiceParameter.binding.id);
  },
);

When<ContainerWorld & ResultWorld & ValueServiceWorld>(
  'an instace of the value service is requested',
  function (): void {
    this.result = this.container.get(this.valueServiceParameter.binding.id);
  },
);

When<ContainerWorld & TypeServiceWorld>(
  'the type service dependencies are bound',
  function () {
    bindServiceDependencies.bind(this)(this.typeServiceParameter);
  },
);

When<ContainerWorld & TypeServiceWorld>(
  'the type service is bound',
  function (): void {
    this.container.bind(this.typeServiceParameter.service);
  },
);

When<ContainerWorld & ValueServiceWorld>(
  'the value service is bound',
  function (): void {
    this.container.bindToValue(
      this.valueServiceParameter.binding.id,
      this.valueServiceParameter.service,
    );
  },
);

When<ContainerWorld & ResultWorld>(
  'container metadata is requested',
  function (): void {
    this.result = this.container.getAllBindinds();
  },
);

Then<ResultWorld & TypeServiceWorld>(
  'an instance from the type service is returned',
  function (): void {
    chai
      .expect(this.result)
      .to.be.instanceOf(this.typeServiceParameter.service);
  },
);

Then<ResultWorld & ValueServiceWorld>(
  'an instance from the value service is returned',
  function () {
    chai
      .expect(this.result)
      .to.be.equal(this.valueServiceParameter.binding.value);
  },
);

Then<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'the instance from the type service was constructed with the right parameters',
  function () {
    const metadataProvider: MetadataProviderApi = MetadataProviderApi.build();

    const instanceMetadata: ClassMetadataApi =
      metadataProvider.getClassMetadata(this.typeServiceParameter.service);

    const constructorMetadataBindings: (BindingApi | undefined)[] =
      instanceMetadata.constructorArguments.map(getBinding.bind(this));

    const constructorArgumentMatchers: sinon.SinonMatcher[] =
      constructorMetadataBindings.map(bindingToSinonMatcher);

    chai.expect(this.typeServiceParameter.spy.callCount).to.be.equal(1);

    chai
      .expect(this.typeServiceParameter.spy)
      .to.have.been.calledOnceWith(...constructorArgumentMatchers);
  },
);

Then<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'the instance from the type service has the right properties',
  function () {
    const metadataProvider: MetadataProviderApi = MetadataProviderApi.build();

    const instanceMetadata: ClassMetadataApi =
      metadataProvider.getClassMetadata(this.typeServiceParameter.service);

    const propertiesMetadataBindings: [
      string | symbol,
      BindingApi | undefined,
    ][] = [...instanceMetadata.properties.entries()].map(
      ([propertyName, serviceId]: [string | symbol, ServiceId]) => [
        propertyName,
        getBinding.bind(this)(serviceId),
      ],
    );

    const propertyChaiAssertions: ((result: unknown) => void)[] =
      propertiesMetadataBindings.map(
        ([propertyName, binding]: [string | symbol, BindingApi | undefined]) =>
          (result: unknown) => {
            propertyBindingToChaiAssertionInvocation(
              result,
              propertyName,
              binding,
            );
          },
      );

    for (const propertyChaiAssertion of propertyChaiAssertions) {
      propertyChaiAssertion(this.result);
    }
  },
);

Then<TypeServiceWorld & ResultWorld>(
  'type service metadata is included in the result',
  function (): void {
    chai.expect(this.result).to.deep.include(this.typeServiceParameter.binding);
  },
);

Then<ValueServiceWorld & ResultWorld>(
  'value service metadata is included in the result',
  function (): void {
    chai
      .expect(this.result)
      .to.deep.include(this.valueServiceParameter.binding);
  },
);
