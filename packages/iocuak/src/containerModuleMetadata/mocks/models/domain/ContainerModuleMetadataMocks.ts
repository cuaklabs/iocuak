import { jest } from '@jest/globals';

import { ClassElementMetadataType } from '../../../../classMetadata/models/domain/ClassElementMetadataType';
import { Newable } from '../../../../common/models/domain/Newable';
import { ContainerModule } from '../../../../containerModule/models/domain/ContainerModule';
import { ContainerModuleClassMetadata } from '../../../models/domain/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../../models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../../../models/domain/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../../models/domain/ContainerModuleMetadataType';

export class ContainerModuleMetadataMocks {
  static #classFixture: Newable<ContainerModule> = class Foo
    implements ContainerModule
  {
    public load(): void {
      return undefined;
    }
  };

  public static get any(): ContainerModuleMetadata {
    const fixture: ContainerModuleMetadata = {
      factory: jest.fn<ContainerModuleFactoryMetadata['factory']>(),
      imports: [],
      injects: [],
      type: ContainerModuleMetadataType.factory,
    };

    return fixture;
  }

  public static get withImportsEmptyAndInjectsEmpty(): ContainerModuleFactoryMetadata {
    const fixture: ContainerModuleFactoryMetadata = {
      ...ContainerModuleMetadataMocks.withTypeFactory,
      imports: [],
      injects: [],
    };

    return fixture;
  }

  public static get withImportsEmptyAndInjectsWithOneServiceId(): ContainerModuleFactoryMetadata {
    const fixture: ContainerModuleFactoryMetadata = {
      ...ContainerModuleMetadataMocks.withTypeFactory,
      imports: [],
      injects: [
        {
          type: ClassElementMetadataType.serviceId,
          value: 'service-id',
        },
      ],
    };

    return fixture;
  }

  public static get withTypeClazz(): ContainerModuleClassMetadata {
    const fixture: ContainerModuleMetadata = {
      imports: [],
      loader: () => undefined,
      moduleType: ContainerModuleMetadataMocks.#classFixture,
      type: ContainerModuleMetadataType.clazz,
    };

    return fixture;
  }

  public static get withTypeFactory(): ContainerModuleFactoryMetadata {
    const fixture: ContainerModuleMetadata = {
      factory: jest.fn<ContainerModuleFactoryMetadata['factory']>(),
      imports: [],
      injects: [],
      type: ContainerModuleMetadataType.factory,
    };

    return fixture;
  }
}
