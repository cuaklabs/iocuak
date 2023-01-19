import { jest } from '@jest/globals';

import { Newable } from '@cuaklabs/iocuak-common';

import { BindingService } from '../../../binding/services/BindingService';
import { ContainerModule } from '../../../containerModule/models/ContainerModule';
import { ContainerModuleClassMetadata } from '../../models/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../models/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../../models/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../models/ContainerModuleMetadataType';

export class ContainerModuleMetadataMocks {
  static #classFixture: Newable<jest.Mocked<ContainerModule>> = class Foo
    implements jest.Mocked<ContainerModule>
  {
    public readonly load: jest.Mock<
      (containerBindingService: BindingService) => void
    >;

    constructor() {
      this.load = jest.fn();
    }
  };

  public static get any(): jest.Mocked<ContainerModuleFactoryMetadata> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadata> = {
      factory: jest.fn(),
      id: undefined,
      imports: [],
      injects: [],
      requires: [],
      type: ContainerModuleMetadataType.factory,
    };

    return fixture;
  }

  public static get withId(): jest.Mocked<ContainerModuleFactoryMetadata> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadata> = {
      ...ContainerModuleMetadataMocks.any,
      id: 'container-module-metadata-id',
    };

    return fixture;
  }

  public static get withIdAndRequiresEmptyArray(): jest.Mocked<ContainerModuleFactoryMetadata> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadata> = {
      ...ContainerModuleMetadataMocks.withId,
      requires: [],
    };

    return fixture;
  }

  public static get withNoId(): jest.Mocked<ContainerModuleFactoryMetadata> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadata> = {
      ...ContainerModuleMetadataMocks.any,
      id: undefined,
    };

    return fixture;
  }

  public static get withNoIdAndRequiresEmptyArray(): jest.Mocked<ContainerModuleMetadata> {
    const fixture: jest.Mocked<ContainerModuleMetadata> = {
      ...ContainerModuleMetadataMocks.withNoId,
      requires: [],
    };

    return fixture;
  }

  public static get withTypeClazz(): jest.Mocked<ContainerModuleClassMetadata> {
    const fixture: jest.Mocked<ContainerModuleClassMetadata> = {
      id: undefined,
      imports: [],
      loader: jest.fn(),
      moduleType: jest
        .fn()
        .mockImplementation(
          () => new ContainerModuleMetadataMocks.#classFixture(),
        ),
      requires: [],
      type: ContainerModuleMetadataType.clazz,
    };

    return fixture;
  }

  public static get withRequiresEmptyArray(): jest.Mocked<ContainerModuleMetadata> {
    const fixture: jest.Mocked<ContainerModuleMetadata> = {
      ...ContainerModuleMetadataMocks.any,
      requires: [],
    };

    return fixture;
  }

  public static get withTypeFactory(): jest.Mocked<ContainerModuleFactoryMetadata> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadata> = {
      factory: jest.fn(),
      id: undefined,
      imports: [],
      injects: [],
      requires: [],
      type: ContainerModuleMetadataType.factory,
    };

    return fixture;
  }
}
