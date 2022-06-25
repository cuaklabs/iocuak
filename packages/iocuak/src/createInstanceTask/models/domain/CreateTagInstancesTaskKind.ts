import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';

export interface CreateTagInstancesTaskKind
  extends BaseTaskKind<TaskKindType.createTagInstances> {
  tag: BindingTag;
}
