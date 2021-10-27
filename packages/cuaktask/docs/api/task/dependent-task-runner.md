# class DependentTaskRunner

## Methods

### public run<TKind, TDependencyKind, TArgs extends unknown[], TReturn>(dependenTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn>): MayBePromise<TReturn>

Runs a given task.

**Parameters**
- dependenTask dependent task to run

**Returns**: Result of the task execution. It may be encapsulated into a Promise if a dependent task execution is asyncronous.