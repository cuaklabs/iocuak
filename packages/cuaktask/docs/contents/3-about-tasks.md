# About tasks

What is a task? `DependentTask` (a.k.a. task) is the following interface:

```ts
type NonThenableProperties<T> = {
  [TKey in keyof T]: T[TKey] extends PromiseLike<unknown> ? never : T[TKey];
};

export enum TaskStatus {
  /**
   * The task is successfully accomplished with no errors.
   */
  Ended,
  /**
   * The task could not be accomplished due to some errors.
   */
  Error,
  /**
   * The task is being accomplished.
   */
  InProgress,
  /**
   * The task is not started.
   */
  NotStarted,
}

interface Task<TKind, TArgs extends unknown[], TReturn> {
  readonly kind: TKind;
  readonly status: TaskStatus;
  perform(...args: NonThenableProperties<TArgs>): TReturn;
}

interface DependentTask<
  TKind,
  TDependencyKind = unknown,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> extends Task<TKind, TArgs, TReturn> {
  readonly dependencies: DependentTask<TDependencyKind>[];
}
```

So, in brief:

- A task has a kind which may be used to detect circular dependencies.
- A task has a status which represents different task states. It's used internally by the task runner in order to schedule task executions.
- A task provides a perform method to execute the task. This method may (or may not) be asyncronous. This method receives non promise values. An asyncronous dependency task execution is awaited by the `TaskRunner` in order to resolve any promise value before starting the execution of any dependent task.
- A task has dependencies. A task may be created with no dependencies and later added by, as an example, a `TaskBuilder`.

May we jump to the [task dependency engine](./4-about-task-dependency-engines)?
