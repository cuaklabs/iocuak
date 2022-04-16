import { ContainerModuleLoadFromMetadataTaskKind } from '../../../models/domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleTaskKindType } from '../../../models/domain/ContainerModuleTaskKindType';
import { ContainerModuleMetadataMocks } from './ContainerModuleMetadataMocks';

export class ContainerModuleLoadFromMetadataTaskKindMocks {
  public static get any(): ContainerModuleLoadFromMetadataTaskKind {
    const fixture: ContainerModuleLoadFromMetadataTaskKind = {
      metadata: ContainerModuleMetadataMocks.any,
      type: ContainerModuleTaskKindType.loadFromMetadata,
    };

    return fixture;
  }

  public static get withMetadataWithImportsEmptyAndInjectsEmpty(): ContainerModuleLoadFromMetadataTaskKind {
    const fixture: ContainerModuleLoadFromMetadataTaskKind = {
      ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
      metadata: ContainerModuleMetadataMocks.withImportsEmptyAndInjectsEmpty,
    };

    return fixture;
  }

  public static get withMetadataWithImportsEmptyAndInjectsWithOneServiceId(): ContainerModuleLoadFromMetadataTaskKind {
    const fixture: ContainerModuleLoadFromMetadataTaskKind = {
      ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
      metadata:
        ContainerModuleMetadataMocks.withImportsEmptyAndInjectsWithOneServiceId,
    };

    return fixture;
  }
}
