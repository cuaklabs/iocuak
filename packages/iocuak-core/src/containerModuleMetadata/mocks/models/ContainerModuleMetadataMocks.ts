import { jest } from '@jest/globals';

import { Newable } from '@cuaklabs/iocuak-common';

import { BindingService } from '../../../binding/services/BindingService';
import { ContainerModule } from '../../../containerModule/models/ContainerModule';
import { ContainerModuleClassMetadata } from '../../models/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../models/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadataType } from '../../models/ContainerModuleMetadataType';

export class ContainerModuleMetadataMocks {
  static readonly #classFixture: Newable<jest.Mocked<ContainerModule>> =
    class Foo implements jest.Mocked<ContainerModule> {
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
      id: 'module-metadata-id',
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

  public static get withTypeClazz(): jest.Mocked<ContainerModuleClassMetadata> {
    const fixture: jest.Mocked<ContainerModuleClassMetadata> = {
      id: 'module-metadata-id',
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

  public static get withRequiresEmptyArray(): jest.Mocked<ContainerModuleFactoryMetadata> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadata> = {
      ...ContainerModuleMetadataMocks.any,
      requires: [],
    };

    return fixture;
  }

  public static get withTypeFactory(): jest.Mocked<ContainerModuleFactoryMetadata> {
    const fixture: jest.Mocked<ContainerModuleFactoryMetadata> = {
      factory: jest.fn(),
      id: 'module-metadata-id',
      injects: [],
      requires: [],
      type: ContainerModuleMetadataType.factory,
    };

    return fixture;
  }
}
