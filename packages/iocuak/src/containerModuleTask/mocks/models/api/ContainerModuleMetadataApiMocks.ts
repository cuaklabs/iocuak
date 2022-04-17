import { ContainerModuleMetadataApi } from '../../../models/api/ContainerModuleMetadataApi';

export class ContainerModuleMetadataApiMocks {
  public static get any(): jest.Mocked<ContainerModuleMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleMetadataApi> = {
      factory: jest.fn(),
      imports: [],
      injects: [],
    };

    return fixture;
  }
}
