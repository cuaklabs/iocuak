import {
  ContainerModule,
  ContainerModuleBindingService,
  ContainerModuleClassMetadata,
  injectable,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';

export function getContainerModuleMetadataWithModuleParameter(): ContainerModuleMetadataParameter<ContainerModuleClassMetadata> {
  const loadSpy: sinon.SinonSpy = sinon.spy();
  const spy: sinon.SinonSpy = sinon.spy();

  @injectable()
  class ContainerModuleClass implements ContainerModule {
    constructor() {
      spy();
    }

    public load(
      containerModuleBindingService: ContainerModuleBindingService,
    ): void {
      loadSpy(containerModuleBindingService);
    }
  }

  const containerModuleMetadata: ContainerModuleClassMetadata = {
    module: ContainerModuleClass,
  };

  const containerModuleMetadaParameter: ContainerModuleMetadataParameter<ContainerModuleClassMetadata> =
    {
      containerModuleMetadata,
      loadSpy,
      spy,
    };

  return containerModuleMetadaParameter;
}
