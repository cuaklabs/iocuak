import { Given, When, Then } from '@cucumber/cucumber';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { BindingApi } from '../../../binding/models/api/BindingApi';
import { BindingTypeApi } from '../../../binding/models/api/BindingTypeApi';
import { ClassElementMetadataApi } from '../../../classMetadata/models/api/ClassElementMetadataApi';
import { ClassElementMetadatApiType } from '../../../classMetadata/models/api/ClassElementMetadatApiType';
import { ClassMetadataApi } from '../../../classMetadata/models/api/ClassMetadataApi';
import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerApi } from '../../../container/modules/api/ContainerApi';
import { ContainerModuleClassMetadataApi } from '../../../containerModuleMetadata/models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../../containerModuleMetadata/models/api/ContainerModuleFactoryMetadataApi';
import { MetadataProviderApi } from '../../../metadata/modules/api/MetadataProviderApi';
import { ResultWorld } from '../common/models/worlds/ResultWorld';
import { TwoResultsWorld } from '../common/models/worlds/TwoResultsWorld';
import { TypeServiceWorld } from '../common/models/worlds/TypeServiceWorld';
import { ValueServiceWorld } from '../common/models/worlds/ValueServiceWorld';
import { TypeServiceParameter } from '../common/parameters/typeService/TypeServiceParameter';
import { ValueServiceParameter } from '../common/parameters/valueService/ValueServiceParameter';
import { ContainerModuleMetadataWorld } from './models/worlds/ContainerModuleMetadataWorld';
import { ContainerModuleWorld } from './models/worlds/ContainerModuleWorld';
import { ContainerWorld } from './models/worlds/ContainerWorld';
import { ContainerModuleParameter } from './parameters/containerModule/ContainerModuleParameter';
import { ContainerModuleMetadataParameter } from './parameters/containerModuleMetadata/ContainerModuleMetadataParameter';

chai.use(sinonChai);

function areTypeDependenciesCalledTimes(
  typeServiceParameter: TypeServiceParameter,
  times: number,
): void {
  const typeDependencies: TypeServiceParameter[] =
    getTypeServiceParameterDependencies(typeServiceParameter);

  for (const dependency of typeDependencies) {
    const typeServiceParameterDependency: TypeServiceParameter = dependency;

    chai
      .expect(typeServiceParameterDependency.spy.callCount)
      .to.be.equal(times);
  }
}

function areTypeDependenciesDependenciesCalledTimes(
  typeServiceParameter: TypeServiceParameter,
  times: number,
): void {
  const typeDependencies: TypeServiceParameter[] =
    getTypeServiceParameterDependencies(typeServiceParameter);

  for (const dependency of typeDependencies) {
    const typeServiceParameterDependency: TypeServiceParameter = dependency;

    areTypeDependenciesCalledTimes(typeServiceParameterDependency, times);
  }
}

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
  container: ContainerApi,
  serviceId: ServiceId,
): BindingApi | undefined {
  const containerBindings: BindingApi[] = container.getAllBindinds();
  const metadataProvider: MetadataProviderApi = MetadataProviderApi.build();

  return (
    containerBindings.find((binding: BindingApi) => binding.id === serviceId) ??
    (typeof serviceId === 'function'
      ? metadataProvider.getBindingMetadata(serviceId)
      : undefined)
  );
}

function getBindingFromClassElementMetadata(
  container: ContainerApi,
  classElementMetadataApi: ClassElementMetadataApi,
): BindingApi | undefined {
  if (classElementMetadataApi.type === ClassElementMetadatApiType.serviceId) {
    return getBinding(container, classElementMetadataApi.value);
  } else {
    throw new Error('Unexpected non service metadata');
  }
}

function getTypeServiceParameterDependencies(
  typeServiceParameter: TypeServiceParameter,
): TypeServiceParameter[] {
  const dependencies: (TypeServiceParameter | ValueServiceParameter)[] =
    typeServiceParameter.dependencies ?? [];

  const typeDependencies: TypeServiceParameter[] = dependencies.filter(
    isTypeServiceParameter,
  );

  return typeDependencies;
}

function isCalledOnceWith(
  parameterBindings: (BindingApi | undefined)[],
  spy: sinon.SinonSpy,
): void {
  const constructorArgumentMatchers: sinon.SinonMatcher[] =
    parameterBindings.map(bindingToSinonMatcher);

  chai.expect(spy.callCount).to.be.equal(1);

  chai.expect(spy).to.have.been.calledOnceWith(...constructorArgumentMatchers);
}

function isContainerModuleMetadataInitialized(
  container: ContainerApi,
  containerModuleMetadataParameter: ContainerModuleMetadataParameter,
): void {
  if (
    (
      containerModuleMetadataParameter.containerModuleMetadata as ContainerModuleClassMetadataApi
    ).module !== undefined
  ) {
    isTypeServiceInitialized(
      container,
      containerModuleMetadataParameter.containerModuleMetadata
        .constructor as Newable,
      containerModuleMetadataParameter.spy,
    );
  } else {
    const containerModuleMetadata: ContainerModuleFactoryMetadataApi =
      containerModuleMetadataParameter.containerModuleMetadata as ContainerModuleFactoryMetadataApi;

    const constructorMetadataBindings: (BindingApi | undefined)[] = (
      containerModuleMetadata.injects ?? []
    ).map((serviceId: ServiceId) => getBinding(container, serviceId));

    isCalledOnceWith(
      constructorMetadataBindings,
      containerModuleMetadataParameter.spy,
    );
  }
}

function isContainerModuleMetadataLoaded(
  containerModuleMetadataParameter: ContainerModuleMetadataParameter,
): void {
  chai.expect(containerModuleMetadataParameter.loadSpy.callCount).to.equal(1);

  chai.expect(containerModuleMetadataParameter.loadSpy).to.calledOnceWith(
    // eslint-disable-next-line import/no-named-as-default-member
    sinon.match({
      // eslint-disable-next-line import/no-named-as-default-member
      bind: sinon.match.instanceOf(Function),
      // eslint-disable-next-line import/no-named-as-default-member
      bindToValue: sinon.match.instanceOf(Function),
    }),
  );
}

function isTypeServiceInitialized(
  container: ContainerApi,
  service: Newable,
  constructorSpy: sinon.SinonSpy,
): void {
  const metadataProvider: MetadataProviderApi = MetadataProviderApi.build();

  const instanceMetadata: ClassMetadataApi =
    metadataProvider.getClassMetadata(service);

  const constructorMetadataBindings: (BindingApi | undefined)[] =
    instanceMetadata.constructorArguments.map(
      (classElementMetadata: ClassElementMetadataApi) =>
        getBindingFromClassElementMetadata(container, classElementMetadata),
    );

  isCalledOnceWith(constructorMetadataBindings, constructorSpy);
}

function isTypeServiceParameter(
  parameter: TypeServiceParameter | ValueServiceParameter,
): parameter is TypeServiceParameter {
  return parameter.binding.bindingType === BindingTypeApi.type;
}

function isTypeServicePropertiesAssigned(
  container: ContainerApi,
  instance: unknown,
  service: Newable,
): void {
  const metadataProvider: MetadataProviderApi = MetadataProviderApi.build();

  const instanceMetadata: ClassMetadataApi =
    metadataProvider.getClassMetadata(service);

  const propertiesMetadataBindings: [
    string | symbol,
    BindingApi | undefined,
  ][] = [...instanceMetadata.properties.entries()].map(
    ([propertyName, classElementMetadata]: [
      string | symbol,
      ClassElementMetadataApi,
    ]) => [
      propertyName,
      getBindingFromClassElementMetadata(container, classElementMetadata),
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
    propertyChaiAssertion(instance);
  }
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

Given<ContainerModuleWorld>(
  'a {containerModule}',
  function (containerModuleParameter: ContainerModuleParameter) {
    this.containerModuleParameter = containerModuleParameter;
  },
);

Given<ContainerModuleMetadataWorld>(
  'a {containerModuleMetadata}',
  function (containerModuleMetadaParameter: ContainerModuleMetadataParameter) {
    this.containerModuleMetadataParameter = containerModuleMetadaParameter;
  },
);

When<ContainerWorld & TypeServiceWorld & TwoResultsWorld>(
  'a second instace of the type service is requested',
  function (): void {
    try {
      this.secondResult = this.container.get(
        this.typeServiceParameter.binding.id,
      );
    } catch (error: unknown) {
      this.error = error;
    }
  },
);

When<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'an instace of the type service is requested',
  function (): void {
    try {
      this.result = this.container.get(this.typeServiceParameter.binding.id);
    } catch (error: unknown) {
      this.error = error;
    }
  },
);

When<ContainerWorld & ResultWorld & ValueServiceWorld>(
  'an instace of the value service is requested',
  function (): void {
    try {
      this.result = this.container.get(this.valueServiceParameter.binding.id);
    } catch (error: unknown) {
      this.error = error;
    }
  },
);

When<ContainerWorld & ContainerModuleMetadataWorld>(
  'the container module metadata is loaded',
  async function (): Promise<void> {
    await this.container.loadMetadata(
      this.containerModuleMetadataParameter.containerModuleMetadata,
    );
  },
);

When<ContainerWorld & ContainerModuleWorld>(
  'the container module is loaded',
  function () {
    this.container.load(this.containerModuleParameter.containerModule);
  },
);

When<ContainerWorld & TypeServiceWorld>(
  'the type service dependencies are bound',
  function () {
    bindServiceDependencies.bind(this)(this.typeServiceParameter);
  },
);

When<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'the type service is bound',
  function (): void {
    try {
      this.container.bind(this.typeServiceParameter.service);
    } catch (error: unknown) {
      this.error = error;
    }
  },
);

When<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'the type service is unbound',
  function (): void {
    this.container.unbind(this.typeServiceParameter.binding.id);
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

When<ContainerWorld & ValueServiceWorld>(
  'the value service is unbound',
  function (): void {
    this.container.unbind(this.valueServiceParameter.binding.id);
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

Then<ContainerWorld & ContainerModuleMetadataWorld>(
  'container metadata container metadata imports are initialized',
  function () {
    if (this.containerModuleMetadataParameter.importParameters !== undefined) {
      for (const containerModuleMetadaParameter of this
        .containerModuleMetadataParameter.importParameters) {
        isContainerModuleMetadataInitialized(
          this.container,
          containerModuleMetadaParameter,
        );
      }
    }
  },
);

Then<ContainerModuleMetadataWorld>(
  'container metadata container metadata imports are loaded',
  function () {
    if (this.containerModuleMetadataParameter.importParameters !== undefined) {
      for (const containerModuleMetadaParameter of this
        .containerModuleMetadataParameter.importParameters) {
        isContainerModuleMetadataLoaded(containerModuleMetadaParameter);
      }
    }
  },
);

Then<ContainerWorld & ContainerModuleMetadataWorld>(
  'container metadata is initialized',
  function () {
    isContainerModuleMetadataInitialized(
      this.container,
      this.containerModuleMetadataParameter,
    );
  },
);

Then<ContainerModuleMetadataWorld>('container metadata is loaded', function () {
  isContainerModuleMetadataLoaded(this.containerModuleMetadataParameter);
});

Then<ContainerModuleWorld & ResultWorld>(
  'container services metadata are included in the result',
  function () {
    const bindings: BindingApi[] = [
      ...this.containerModuleParameter.typeServices,
      ...this.containerModuleParameter.valueServices,
    ].map(
      (serviceParameter: TypeServiceParameter | ValueServiceParameter) =>
        serviceParameter.binding,
    );

    for (const binding of bindings) {
      chai.expect(this.result).to.deep.include(binding);
    }
  },
);

Then<ResultWorld & TypeServiceWorld>(
  'every type dependency constructor is the same one and has been caled {int} times',
  function (times: number): void {
    areTypeDependenciesCalledTimes(this.typeServiceParameter, times);
  },
);

Then<ResultWorld & TypeServiceWorld>(
  'every type dependency dependency constructor is the same one and has been caled {int} times',
  function (times: number): void {
    areTypeDependenciesDependenciesCalledTimes(
      this.typeServiceParameter,
      times,
    );
  },
);

Then<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'the instance from the type service was constructed with the right parameters',
  function () {
    isTypeServiceInitialized(
      this.container,
      this.typeServiceParameter.service,
      this.typeServiceParameter.spy,
    );
  },
);

Then<ContainerWorld & ResultWorld & TypeServiceWorld>(
  'the instance from the type service has the right properties',
  function () {
    isTypeServicePropertiesAssigned(
      this.container,
      this.result,
      this.typeServiceParameter.service,
    );
  },
);

Then<TypeServiceWorld & ResultWorld>(
  'type service metadata is included in the result',
  function (): void {
    chai.expect(this.result).to.deep.include(this.typeServiceParameter.binding);
  },
);

Then<TypeServiceWorld & ResultWorld>(
  'type service metadata is not included in the result',
  function (): void {
    chai
      .expect(this.result)
      .not.to.deep.include(this.typeServiceParameter.binding);
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

Then<ValueServiceWorld & ResultWorld>(
  'value service metadata is not included in the result',
  function (): void {
    chai
      .expect(this.result)
      .not.to.deep.include(this.valueServiceParameter.binding);
  },
);
