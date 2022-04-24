import { ContainerModuleClassMetadataApi } from '../../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleMetadataApi } from '../../../models/api/ContainerModuleMetadataApi';

export class ContainerModuleMetadataApiMocks {
  public static get any(): jest.Mocked<ContainerModuleMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleMetadataApi> = {
      factory: jest.fn(),
      imports: [],
    };

    return fixture;
  }

  public static get anyContainerModuleClassMetadataApi(): jest.Mocked<ContainerModuleClassMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleClassMetadataApi> = {
      imports: [],
      module: jest.fn(),
    };

    return fixture;
  }

  public static get anyContainerModuleFactoryMetadataApi(): jest.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleMetadataApi> = {
      factory: jest.fn(),
      imports: [],
    };

    return fixture;
  }

  public static get withInjects(): jest.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleMetadataApi> = {
      ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
      injects: ['service-id'],
    };

    return fixture;
  }

  public static get withNoInjects(): jest.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleMetadataApi> = {
      ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
    };

    delete fixture.injects;

    return fixture;
  }
}
