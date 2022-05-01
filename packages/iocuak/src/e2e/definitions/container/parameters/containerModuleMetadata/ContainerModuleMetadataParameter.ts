import sinon from 'sinon';

import { ContainerModuleMetadataApi } from '../../../../../containerModuleTask/models/api/ContainerModuleMetadataApi';

export interface ContainerModuleMetadataParameter<
  TContainerModuleMetadata extends ContainerModuleMetadataApi = ContainerModuleMetadataApi,
> {
  containerModuleMetadata: TContainerModuleMetadata;
  importParameters?: ContainerModuleMetadataParameter[];
  loadSpy: sinon.SinonSpy;
  spy: sinon.SinonSpy;
}
