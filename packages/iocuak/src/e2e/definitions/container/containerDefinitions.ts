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
import { ContainerWorld } from './models/worlds/ContainerWorld';

chai.use(sinonChai);

Given<ContainerWorld>('a container', function (): void {
  this.container = ContainerApi.build();
});

When<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'an instace of the type service is requested',
  function (): void {
    this.result = this.container.get(this.typeServiceBinding.id);
  },
);

When<ContainerWorld & TypeServiceWorld>(
  'the type service is bound',
  function (): void {
    this.container.bind(this.typeService);
  },
);

When<ContainerWorld & ValueServiceWorld>(
  'the value service is bound',
  function (): void {
    this.container.bindToValue(this.valueServiceBinding.id, this.valueService);
  },
);

When<ContainerWorld & ResultWorld>(
  'container metadata is requested',
  function (): void {
    this.result = this.container.getAllBindinds();
  },
);

Then<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'an instance from the type service is returned',
  function (): void {
    const containerBindings: BindingApi[] = this.container.getAllBindinds();
    const metadataProvider: MetadataProviderApi = MetadataProviderApi.build();

    const instanceMetadata: ClassMetadataApi =
      metadataProvider.getClassMetadata(this.typeService);

    function getBinding(serviceId: ServiceId): BindingApi | undefined {
      return (
        containerBindings.find(
          (binding: BindingApi) => binding.id === serviceId,
        ) ??
        (typeof serviceId === 'function'
          ? metadataProvider.getBindingMetadata(serviceId)
          : undefined)
      );
    }

    const constructorMetadataBindings: (BindingApi | undefined)[] =
      instanceMetadata.constructorArguments.map(getBinding);

    const constructorArgumentMatchers: sinon.SinonMatcher[] =
      constructorMetadataBindings.map(
        (binding: BindingApi | undefined, index: number) => {
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
        },
      );

    const propertiesMetadataBindings: [
      string | symbol,
      BindingApi | undefined,
    ][] = [...instanceMetadata.properties.entries()].map(
      ([propertyName, serviceId]: [string | symbol, ServiceId]) => [
        propertyName,
        getBinding(serviceId),
      ],
    );

    const propertyChaiAssertions: ((result: unknown) => void)[] =
      propertiesMetadataBindings.map(
        ([propertyName, binding]: [string | symbol, BindingApi | undefined]) =>
          (result: unknown) => {
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
          },
      );

    chai
      .expect(
        // eslint-disable-next-line import/no-named-as-default-member
        this.typeServiceSpy.callCount,
      )
      .to.be.equal(1);

    chai
      .expect(
        // eslint-disable-next-line import/no-named-as-default-member
        this.typeServiceSpy,
      )
      .to.have.been.calledOnceWith(...constructorArgumentMatchers);

    for (const propertyChaiAssertion of propertyChaiAssertions) {
      propertyChaiAssertion(this.result);
    }
  },
);

Then<TypeServiceWorld & ResultWorld>(
  'type service metadata is included in the result',
  function (): void {
    chai.expect(this.result).to.deep.include(this.typeServiceBinding);
  },
);

Then<ValueServiceWorld & ResultWorld>(
  'value service metadata is included in the result',
  function (): void {
    chai.expect(this.result).to.deep.include(this.valueServiceBinding);
  },
);
