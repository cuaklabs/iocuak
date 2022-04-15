import { ContainerModuleMetadataApi } from '../../../models/api/ContainerModuleMetadataApi';

export class ContainerModuleMetadataApiMocks {
  public static get any(): ContainerModuleMetadataApi {
    const fixture: ContainerModuleMetadataApi = {
      factory: jest.fn(),
      imports: [],
      injects: [],
    };

    return fixture;
  }

  public static get withImportsEmptyAndInjectsEmpty(): ContainerModuleMetadataApi {
    const fixture: ContainerModuleMetadataApi = {
      ...ContainerModuleMetadataApiMocks.any,
      imports: [],
      injects: [],
    };

    return fixture;
  }

  public static get withImportsEmptyAndInjectsWithOneServiceId(): ContainerModuleMetadataApi {
    const fixture: ContainerModuleMetadataApi = {
      ...ContainerModuleMetadataApiMocks.any,
      imports: [],
      injects: ['service-id'],
    };

    return fixture;
  }
}
