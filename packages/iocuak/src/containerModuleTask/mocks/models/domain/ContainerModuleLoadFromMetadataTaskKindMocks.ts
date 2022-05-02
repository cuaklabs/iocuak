import { ContainerModuleClassMetadata } from '../../../../containerModuleMetadata/models/domain/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../../../containerModuleMetadata/models/domain/ContainerModuleFactoryMetadata';
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

  public static get withMetadataContainerModuleClassMetadata(): ContainerModuleLoadFromMetadataTaskKind<ContainerModuleClassMetadata> {
    const fixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleClassMetadata> =
      {
        ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
        metadata: ContainerModuleMetadataMocks.withTypeClazz,
      };

    return fixture;
  }

  public static get withMetadataContainerModuleFactoryMetadata(): ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata> {
    const fixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata> =
      {
        ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
        metadata: ContainerModuleMetadataMocks.withTypeFactory,
      };

    return fixture;
  }

  public static get withMetadataWithImportsEmptyAndInjectsEmpty(): ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata> {
    const fixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata> =
      {
        ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
        metadata: ContainerModuleMetadataMocks.withImportsEmptyAndInjectsEmpty,
      };

    return fixture;
  }

  public static get withMetadataWithImportsEmptyAndInjectsWithOneServiceId(): ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata> {
    const fixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata> =
      {
        ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
        metadata:
          ContainerModuleMetadataMocks.withImportsEmptyAndInjectsWithOneServiceId,
      };

    return fixture;
  }
}
