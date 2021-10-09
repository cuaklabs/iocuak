import { ClassMetadata } from '../../../metadata/models/domain/ClassMetadata';
import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export interface GetInstanceDependenciesTaskKind
  extends BaseTaskKind<TaskKindType.getInstanceDependencies> {
  metadata: ClassMetadata;
}
