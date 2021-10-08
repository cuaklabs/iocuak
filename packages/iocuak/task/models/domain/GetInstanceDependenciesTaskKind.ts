import { ClassMetadata } from '../../../metadata/models/ClassMetadata';
import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export interface GetInstanceDependenciesTaskKind
  extends BaseTaskKind<TaskKindType.getInstanceDependencies> {
  metadata: ClassMetadata;
}
