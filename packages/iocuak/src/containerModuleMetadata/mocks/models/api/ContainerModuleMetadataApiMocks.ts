import { jest } from '@jest/globals';

import { ClassElementMetadataApiType } from '@cuaklabs/iocuak-models-api';

import { ContainerModuleClassMetadataApi } from '../../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleMetadataApi } from '../../../models/api/ContainerModuleMetadataApi';

export class ContainerModuleMetadataApiMocks {
  public static get any(): jest.Mocked<ContainerModuleMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleMetadataApi> = {
      factory: jest.fn(),
    };

    return fixture;
  }

  public static get anyContainerModuleClassMetadataApi(): jest.Mocked<ContainerModuleClassMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleClassMetadataApi> = {
      module: jest.fn(),
    };

    return fixture;
  }

  public static get anyContainerModuleClassMetadataApiWithId(): jest.Mocked<ContainerModuleClassMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleClassMetadataApi> = {
      id: 'metadata-id',
      module: jest.fn(),
    };

    return fixture;
  }

  public static get anyContainerModuleFactoryMetadataApi(): jest.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadataApi> = {
      factory: jest.fn(),
    };

    return fixture;
  }

  public static get withInjectsServiceId(): jest.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadataApi> = {
      ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
      injects: ['service-id'],
    };

    return fixture;
  }

  public static get withInjectsClassElementServiceIdMetadata(): jest.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadataApi> = {
      ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
      injects: [
        {
          type: ClassElementMetadataApiType.serviceId,
          value: 'service-id',
        },
      ],
    };

    return fixture;
  }

  public static get withInjectsClassElementTagMetadata(): jest.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadataApi> = {
      ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
      injects: [
        {
          type: ClassElementMetadataApiType.tag,
          value: 'tag',
        },
      ],
    };

    return fixture;
  }

  public static get withNoInjects(): jest.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadataApi> = {
      ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
    };

    delete fixture.injects;

    return fixture;
  }
}
