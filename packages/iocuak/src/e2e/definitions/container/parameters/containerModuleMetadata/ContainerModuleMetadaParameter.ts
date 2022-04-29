import sinon from 'sinon';

import { ContainerModuleMetadataApi } from '../../../../../containerModuleTask/models/api/ContainerModuleMetadataApi';

export interface ContainerModuleMetadaParameter {
  containerModuleMetadata: ContainerModuleMetadataApi;
  importParameters?: ContainerModuleMetadaParameter[];
  loadSpy: sinon.SinonSpy;
  spy: sinon.SinonSpy;
}
