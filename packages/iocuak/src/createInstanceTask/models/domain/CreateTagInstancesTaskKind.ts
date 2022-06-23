import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BaseRequestTaskKind } from './BaseRequestTaskKind';
import { TaskKindType } from './TaskKindType';

export interface CreateTagInstancesTaskKind
  extends BaseRequestTaskKind<TaskKindType.createTagInstances> {
  tag: BindingTag;
}
