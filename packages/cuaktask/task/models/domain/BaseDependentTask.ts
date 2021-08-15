import { PromiseIfThenable } from '../../../common/models/PromiseIfThenable';
import { BaseTask } from './BaseTask';
import { DependentTask } from './DependentTask';

export abstract class BaseDependentTask<TKind, TArgs extends unknown[], TReturn>
  extends BaseTask<TKind, TArgs, TReturn>
  implements DependentTask<TKind, TArgs, PromiseIfThenable<TReturn>>
{
  protected _innerDependencies: DependentTask<TKind, unknown[], unknown>[];

  constructor(
    kind: TKind,
    dependencies: DependentTask<TKind, unknown[], unknown>[] = [],
  ) {
    super(kind);

    this._innerDependencies = [...dependencies];
  }

  public get dependencies(): DependentTask<TKind, unknown[], unknown>[] {
    return [...this._innerDependencies];
  }
}
