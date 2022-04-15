import { ContainerModuleLoadFromMetadataTaskKind } from '../../../models/domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleTaskKindType } from '../../../models/domain/ContainerModuleTaskKindType';
import { ContainerModuleMetadataApiMocks } from '../api/ContainerModuleMetadataApiMocks';

export class ContainerModuleLoadFromMetadataTaskKindMocks {
  public static get any(): ContainerModuleLoadFromMetadataTaskKind {
    const fixture: ContainerModuleLoadFromMetadataTaskKind = {
      metadata: ContainerModuleMetadataApiMocks.any,
      type: ContainerModuleTaskKindType.loadFromMetadata,
    };

    return fixture;
  }

  public static get withMetadataWithImportsEmptyAndInjectsEmpty(): ContainerModuleLoadFromMetadataTaskKind {
    const fixture: ContainerModuleLoadFromMetadataTaskKind = {
      ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
      metadata: ContainerModuleMetadataApiMocks.withImportsEmptyAndInjectsEmpty,
    };

    return fixture;
  }

  public static get withMetadataWithImportsEmptyAndInjectsWithOneServiceId(): ContainerModuleLoadFromMetadataTaskKind {
    const fixture: ContainerModuleLoadFromMetadataTaskKind = {
      ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
      metadata:
        ContainerModuleMetadataApiMocks.withImportsEmptyAndInjectsWithOneServiceId,
    };

    return fixture;
  }
}
