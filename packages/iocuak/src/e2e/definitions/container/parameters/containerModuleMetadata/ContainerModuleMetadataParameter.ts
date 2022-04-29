import sinon from 'sinon';

import { ContainerModuleMetadataApi } from '../../../../../containerModuleTask/models/api/ContainerModuleMetadataApi';

export interface ContainerModuleMetadataParameter {
  containerModuleMetadata: ContainerModuleMetadataApi;
  importParameters?: ContainerModuleMetadataParameter[];
  loadSpy: sinon.SinonSpy;
  spy: sinon.SinonSpy;
}
