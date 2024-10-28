import { ContainerModuleMetadata } from '@cuaklabs/iocuak';
import sinon from 'sinon';

export interface ContainerModuleMetadataParameter<
  TContainerModuleMetadata extends
    ContainerModuleMetadata = ContainerModuleMetadata,
> {
  containerModuleMetadata: TContainerModuleMetadata;
  importParameters?: ContainerModuleMetadataParameter[];
  loadSpy: sinon.SinonSpy;
  spy: sinon.SinonSpy;
}
