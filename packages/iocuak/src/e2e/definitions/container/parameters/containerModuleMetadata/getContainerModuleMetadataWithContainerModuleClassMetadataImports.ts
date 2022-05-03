import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { inject } from '../../../../../classMetadata/decorators/inject';
import { Newable } from '../../../../../common/models/domain/Newable';
import { ContainerModuleBindingServiceApi } from '../../../../../container/services/api/ContainerModuleBindingServiceApi';
import { ContainerModuleApi } from '../../../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleClassMetadataApi } from '../../../../../containerModuleMetadata/models/api/ContainerModuleClassMetadataApi';
import { getTypeServiceWithNoDependenciesParameter } from '../../../common/parameters/typeService/getTypeServiceWithNoDependenciesParameter';
import { TypeServiceParameter } from '../../../common/parameters/typeService/TypeServiceParameter';
import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';
import { getContainerModuleMetadataWithModuleParameter } from './getContainerModuleMetadataWithModuleParameter';

export function getContainerModuleMetadataWithContainerModuleClassMetadataImports(): ContainerModuleMetadataParameter {
  const containerModuleClassMetadataParameter: ContainerModuleMetadataParameter<ContainerModuleClassMetadataApi> =
    getContainerModuleMetadataWithModuleParameter();

  const containerModuleClassMetadataParameterClass: Newable<ContainerModuleApi> =
    containerModuleClassMetadataParameter.containerModuleMetadata.module;

  const typeServiceParameter: TypeServiceParameter =
    getTypeServiceWithNoDependenciesParameter();

  @injectable()
  class ContainerModuleClassMetadataParameterClass extends containerModuleClassMetadataParameterClass {
    public override load(
      containerModuleBindingService: ContainerModuleBindingServiceApi,
    ): void {
      super.load(containerModuleBindingService);

      containerModuleBindingService.bind(typeServiceParameter.service);
    }
  }

  const containerModuleClassMetadataParameterMetadata: ContainerModuleClassMetadataApi =
    {
      module: ContainerModuleClassMetadataParameterClass,
    };

  if (
    containerModuleClassMetadataParameter.containerModuleMetadata.imports !==
    undefined
  ) {
    containerModuleClassMetadataParameterMetadata.imports = [
      ...containerModuleClassMetadataParameter.containerModuleMetadata.imports,
    ];
  }

  containerModuleClassMetadataParameter.containerModuleMetadata =
    containerModuleClassMetadataParameterMetadata;

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
    imports: [containerModuleClassMetadataParameter.containerModuleMetadata],
    module: ContainerModuleClass,
  };

  const containerModuleMetadaParameter: ContainerModuleMetadataParameter = {
    containerModuleMetadata,
    importParameters: [containerModuleClassMetadataParameter],
    loadSpy,
    spy,
  };

  return containerModuleMetadaParameter;
}
