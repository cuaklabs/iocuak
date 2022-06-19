import * as cuaktask from '@cuaklabs/cuaktask';

import { DestructureOneTaskKind } from '../domain/DestructureOneTaskKind';

export class DestructureOneTask extends cuaktask.BaseTask<
  DestructureOneTaskKind,
  [unknown],
  unknown
> {
  protected innerPerform(param: unknown): unknown {
    return param;
  }
}
