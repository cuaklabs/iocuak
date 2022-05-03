import sinon from 'sinon';

import { inject } from '../../../../../classMetadata/decorators/inject';
import { ContainerModuleBindingServiceApi } from '../../../../../container/services/api/ContainerModuleBindingServiceApi';
import { ContainerModuleApi } from '../../../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleClassMetadataApi } from '../../../../../containerModuleMetadata/models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../../../../containerModuleMetadata/models/api/ContainerModuleFactoryMetadataApi';
import { injectable } from '../../../../../metadata/decorators/injectable';
import { getTypeServiceWithNoDependenciesParameter } from '../../../common/parameters/typeService/getTypeServiceWithNoDependenciesParameter';
import { TypeServiceParameter } from '../../../common/parameters/typeService/TypeServiceParameter';
import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';

export function getContainerModuleMetadataWithContainerModuleFactoryMetadataImports(): ContainerModuleMetadataParameter {
  const typeServiceParameter: TypeServiceParameter =
    getTypeServiceWithNoDependenciesParameter();

  const containerModuleFactoryMetadataParameterLoadSpy: sinon.SinonSpy =
    // eslint-disable-next-line import/no-named-as-default-member
    sinon.spy();

  const containerModuleFactoryMetadataParameterSpy: sinon.SinonSpy =
    // eslint-disable-next-line import/no-named-as-default-member
    sinon.spy();

  class ContainerModuleFactoryMetadataParameterClass {
    public load(
      containerModuleBindingService: ContainerModuleBindingServiceApi,
    ): void {
      containerModuleFactoryMetadataParameterLoadSpy(
        containerModuleBindingService,
      );

      containerModuleBindingService.bind(typeServiceParameter.service);
    }
  }

  const containerModuleClassMetadataParameterMetadata: ContainerModuleFactoryMetadataApi =
    {
      factory: () => {
        containerModuleFactoryMetadataParameterSpy();

        return new ContainerModuleFactoryMetadataParameterClass();
      },
    };

  const containerModuleFactoryMetadataParameter: ContainerModuleMetadataParameter =
    {
      containerModuleMetadata: containerModuleClassMetadataParameterMetadata,
      loadSpy: containerModuleFactoryMetadataParameterLoadSpy,
      spy: containerModuleFactoryMetadataParameterSpy,
    };

  // eslint-disable-next-line import/no-named-as-default-member
  const loadSpy: sinon.SinonSpy = sinon.spy();
  // eslint-disable-next-line import/no-named-as-default-member
  const spy: sinon.SinonSpy = sinon.spy();

  @injectable()
  class ContainerModuleClass implements ContainerModuleApi {
    constructor(
      @inject(typeServiceParameter.binding.id)
      public readonly typeService: unknown,
    ) {
      spy(typeService);
    }

    public load(
      containerModuleBindingService: ContainerModuleBindingServiceApi,
    ): void {
      loadSpy(containerModuleBindingService);
    }
  }

  const containerModuleMetadata: ContainerModuleClassMetadataApi = {
    imports: [containerModuleClassMetadataParameterMetadata],
    module: ContainerModuleClass,
  };

  const containerModuleMetadaParameter: ContainerModuleMetadataParameter = {
    containerModuleMetadata,
    importParameters: [containerModuleFactoryMetadataParameter],
    loadSpy,
    spy,
  };

  return containerModuleMetadaParameter;
}
