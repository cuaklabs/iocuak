import * as cuaktask from '@cuaklabs/cuaktask';

import { TaskNodeExpandCommandType } from './TaskNodeExpandCommandType';

export interface BaseTaskNodeExpandCommand<
  TContext,
  TTaskKindType extends TaskNodeExpandCommandType,
  TNodeTask extends cuaktask.Task<unknown>,
> {
  context: TContext;
  node: cuaktask.Node<TNodeTask, cuaktask.Task<unknown>>;
  taskKindType: TTaskKindType;
}
