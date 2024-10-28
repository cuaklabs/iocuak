import {
  ContainerModule,
  ContainerModuleFactoryMetadata,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { ContainerModuleParameter } from '../containerModule/ContainerModuleParameter';
import { getContainerModuleWithTypeServiceAndValueServiceParameter } from '../containerModule/getContainerModuleWithTypeServiceAndValueServiceParameter';
import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';

export function getContainerModuleMetadataWithFactoryParameter(): ContainerModuleMetadataParameter {
  const containerModuleParameter: ContainerModuleParameter =
    getContainerModuleWithTypeServiceAndValueServiceParameter();

  const containerModule: ContainerModule =
    containerModuleParameter.containerModule;

  const spy: sinon.SinonSpy = sinon.spy();

  const containerModuleMetadata: ContainerModuleFactoryMetadata = {
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
