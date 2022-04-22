import { ContainerModuleFactoryMetadata } from '../../../models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../../../models/domain/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../../models/domain/ContainerModuleMetadataType';

export class ContainerModuleMetadataMocks {
  public static get any(): ContainerModuleMetadata {
    const fixture: ContainerModuleMetadata = {
      factory: jest.fn(),
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
      injects: ['service-id'],
    };

    return fixture;
  }

  public static get withTypeFactory(): ContainerModuleFactoryMetadata {
    const fixture: ContainerModuleMetadata = {
      factory: jest.fn(),
      imports: [],
      injects: [],
      type: ContainerModuleMetadataType.factory,
    };

    return fixture;
  }
}
