import sinon from 'sinon';

import { ContainerModuleApi } from '../../../../../container/modules/api/ContainerModuleApi';
import { ContainerModuleFactoryMetadataApi } from '../../../../../containerModuleTask/models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleParameter } from '../containerModule/ContainerModuleParameter';
import { getContainerModuleWithTypeServiceAndValueServiceParameter } from '../containerModule/getContainerModuleWithTypeServiceAndValueServiceParameter';
import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';

export function getContainerModuleMetadataWithFactoryParameter(): ContainerModuleMetadataParameter {
  const containerModuleParameter: ContainerModuleParameter =
    getContainerModuleWithTypeServiceAndValueServiceParameter();

  const containerModule: ContainerModuleApi =
    containerModuleParameter.containerModule;

  // eslint-disable-next-line import/no-named-as-default-member
  const spy: sinon.SinonSpy = sinon.spy();

  const containerModuleMetadata: ContainerModuleFactoryMetadataApi = {
    factory: () => {
      spy();
      return containerModule;
    },
  };

  const containerModuleMetadaParameter: ContainerModuleMetadataParameter = {
    containerModuleMetadata,
    loadSpy: containerModuleParameter.loadSpy,
    spy,
  };

  return containerModuleMetadaParameter;
}
