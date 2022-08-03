import { jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { ClassElementMetadataApiType } from '@cuaklabs/iocuak-models-api';

import { ContainerModuleClassMetadataApi } from '../../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleMetadataApi } from '../../../models/api/ContainerModuleMetadataApi';

export class ContainerModuleMetadataApiMocks {
  public static get any(): jestMock.Mocked<ContainerModuleMetadataApi> {
    const fixture: jestMock.Mocked<ContainerModuleMetadataApi> = {
      factory: jest.fn(),
    };

    return fixture;
  }

  public static get anyContainerModuleClassMetadataApi(): jestMock.Mocked<ContainerModuleClassMetadataApi> {
    const fixture: jestMock.Mocked<ContainerModuleClassMetadataApi> = {
      module: jest.fn(),
    };

    return fixture;
  }

  public static get anyContainerModuleFactoryMetadataApi(): jestMock.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jestMock.Mocked<ContainerModuleFactoryMetadataApi> = {
      factory: jest.fn(),
    };

    return fixture;
  }

  public static get withInjectsServiceId(): jestMock.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jestMock.Mocked<ContainerModuleFactoryMetadataApi> = {
      ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
      injects: ['service-id'],
    };

    return fixture;
  }

  public static get withInjectsClassElementServiceIdMetadata(): jestMock.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jestMock.Mocked<ContainerModuleFactoryMetadataApi> = {
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

  public static get withInjectsClassElementTagMetadata(): jestMock.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jestMock.Mocked<ContainerModuleFactoryMetadataApi> = {
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

  public static get withNoInjects(): jestMock.Mocked<ContainerModuleFactoryMetadataApi> {
    const fixture: jestMock.Mocked<ContainerModuleFactoryMetadataApi> = {
      ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
    };

    delete fixture.injects;

    return fixture;
  }
}
