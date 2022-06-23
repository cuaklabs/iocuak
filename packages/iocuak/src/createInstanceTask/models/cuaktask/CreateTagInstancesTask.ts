import { BaseTask } from '@cuaklabs/cuaktask';

import { CreateTagInstancesTaskKind } from '../domain/CreateTagInstancesTaskKind';

export class CreateTagInstancesTask extends BaseTask<
  CreateTagInstancesTaskKind,
  unknown[],
  unknown[]
> {
  protected innerPerform(...services: unknown[]): unknown[] {
    return services;
  }
}
