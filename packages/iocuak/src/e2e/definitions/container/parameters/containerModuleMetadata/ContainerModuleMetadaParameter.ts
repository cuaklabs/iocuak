import sinon from 'sinon';

import { ContainerModuleMetadataApi } from '../../../../../containerModuleTask/models/api/ContainerModuleMetadataApi';

export interface ContainerModuleMetadaParameter {
  containerModuleMetadata: ContainerModuleMetadataApi;
  importParameters?: ContainerModuleMetadaParameter[];
  spy: sinon.SinonSpy;
}
