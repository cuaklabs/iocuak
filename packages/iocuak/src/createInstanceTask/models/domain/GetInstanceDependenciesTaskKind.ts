import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { BaseServiceTaskKind } from './BaseServiceTaskKind';
import { TaskKindType } from './TaskKindType';

export interface GetInstanceDependenciesTaskKind
  extends BaseServiceTaskKind<TaskKindType.getInstanceDependencies> {
  metadata: ClassMetadata;
}
