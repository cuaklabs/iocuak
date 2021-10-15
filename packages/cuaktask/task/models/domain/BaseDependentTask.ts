import { PromiseIfThenable } from '../../../common/models/PromiseIfThenable';
import { BaseTask } from './BaseTask';
import { DependentTask } from './DependentTask';

export abstract class BaseDependentTask<
    TKind,
    TDependencyKind,
    TArgs extends unknown[],
    TReturn,
  >
  extends BaseTask<TKind, TArgs, TReturn>
  implements
    DependentTask<TKind, TDependencyKind, TArgs, PromiseIfThenable<TReturn>>
{
  protected _innerDependencies: DependentTask<TDependencyKind>[];

  constructor(
    kind: TKind,
    dependencies: DependentTask<TDependencyKind>[] = [],
  ) {
    super(kind);

    this._innerDependencies = [...dependencies];
  }

  public get dependencies(): DependentTask<TDependencyKind>[] {
    return this._innerDependencies;
  }
}
