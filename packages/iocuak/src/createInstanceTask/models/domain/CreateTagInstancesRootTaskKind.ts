import { BindingTag } from '../../../index';
import { BaseRequestTaskKind } from './BaseRequestTaskKind';
import { TaskKindType } from './TaskKindType';

export interface CreateTagInstancesRootTaskKind
  extends BaseRequestTaskKind<TaskKindType.createTagInstancesRoot> {
  tag: BindingTag;
}
