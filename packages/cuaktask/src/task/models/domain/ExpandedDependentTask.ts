import { ExpandedTask } from './ExpandedTask';

export type ExpandedDependentTask<
  TKind,
  TDependencyKind,
  TArgs extends unknown[],
  TReturn,
> = ExpandedTask<TKind, TArgs, TReturn> & {
  readonly dependencies: ExpandedDependentTask<
    TDependencyKind,
    unknown,
    unknown[],
    unknown
  >[];
};
