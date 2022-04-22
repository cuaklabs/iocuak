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

  public static get withImportsEmptyAndInjectsEmpty(): ContainerModuleMetadata {
    const fixture: ContainerModuleMetadata = {
      ...ContainerModuleMetadataMocks.any,
      imports: [],
      injects: [],
    };

    return fixture;
  }

  public static get withImportsEmptyAndInjectsWithOneServiceId(): ContainerModuleMetadata {
    const fixture: ContainerModuleMetadata = {
      ...ContainerModuleMetadataMocks.any,
      imports: [],
      injects: ['service-id'],
    };

    return fixture;
  }
}
