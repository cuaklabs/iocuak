import { ClassMetadata } from '../../../metadata/models/ClassMetadata';
import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';
import { TaskScope } from './TaskScope';

export interface GetInstanceDependenciesTaskKind
  extends BaseTaskKind<TaskKindType.getInstanceDependencies> {
  metadata: ClassMetadata;
  scope: TaskScope;
}
