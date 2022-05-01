import sinon from 'sinon';

import { ContainerModuleBindingServiceApi } from '../../../../../container/services/api/ContainerModuleBindingServiceApi';
import { ContainerModuleApi } from '../../../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleClassMetadataApi } from '../../../../../containerModuleTask/models/api/ContainerModuleClassMetadataApi';
import { injectable } from '../../../../../metadata/decorators/injectable';
import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';

export function getContainerModuleMetadataWithModuleParameter(): ContainerModuleMetadataParameter<ContainerModuleClassMetadataApi> {
  // eslint-disable-next-line import/no-named-as-default-member
  const loadSpy: sinon.SinonSpy = sinon.spy();
  // eslint-disable-next-line import/no-named-as-default-member
  const spy: sinon.SinonSpy = sinon.spy();

  @injectable()
  class ContainerModuleClass implements ContainerModuleApi {
    constructor() {
      spy();
    }

    public load(
      containerModuleBindingService: ContainerModuleBindingServiceApi,
    ): void {
      loadSpy(containerModuleBindingService);
    }
  }

  const containerModuleMetadata: ContainerModuleClassMetadataApi = {
    module: ContainerModuleClass,
  };

  const containerModuleMetadaParameter: ContainerModuleMetadataParameter<ContainerModuleClassMetadataApi> =
    {
      containerModuleMetadata,
      loadSpy,
      spy,
    };

  return containerModuleMetadaParameter;
}
