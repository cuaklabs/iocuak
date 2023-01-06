import { jest } from '@jest/globals';

import { Newable } from '@cuaklabs/iocuak-common';

import { ContainerModule } from '../../../containerModule/models/ContainerModule';
import { ContainerModuleClassMetadata } from '../../models/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../models/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../../models/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../models/ContainerModuleMetadataType';

export class ContainerModuleMetadataMocks {
  static #classFixture: Newable<ContainerModule> = class Foo
    implements ContainerModule
  {
    public load(): void {
      return undefined;
    }
  };

  public static get withTypeClazz(): ContainerModuleClassMetadata {
    const fixture: ContainerModuleMetadata = {
      imports: [],
      loader: () => undefined,
      moduleType: ContainerModuleMetadataMocks.#classFixture,
      requires: [],
      type: ContainerModuleMetadataType.clazz,
    };

    return fixture;
  }

  public static get withTypeFactory(): ContainerModuleFactoryMetadata {
    const fixture: ContainerModuleMetadata = {
      factory: jest.fn<ContainerModuleFactoryMetadata['factory']>(),
      imports: [],
      injects: [],
      requires: [],
      type: ContainerModuleMetadataType.factory,
    };

    return fixture;
  }
}
