# About task builders

This module orquestrates any task build process. This library provides a `DependentTaskBuilder` abstract class. An extension of this class should provide a `buildWithNoDependencies` implementation in order to allow the task builder create task instances. `buildWithNoDependencies` should not create tasks with dependencies, dependencies are added by the task builder later.

**Example**

Alice, our brave hero, is extending the task builder.

**Disclaimer** ⚠️: This is not a real-world implementation. Alice may need to provide additional modules to the tasks (such as a database adapter) in order to perform additional logic.

```ts
import { DependentTaskBuilder } from '@cuaklabs/cuaktask';

import { CreateProductTask, CreateUserTask } from 'some/path';

export class TaskBuilder extends DependentTaskBuilder<TaskKind, TaskKind> {

  protected buildWithNoDependencies<TKind, TArgs extends unknown[], TReturn>(
    taskKind: TKind,
  ): DependentTask<TKind, unknown, TArgs, TReturn> {
    if (isTaskKind(taskKind)) {
      switch (taskKind.type) {
        case TaskKindType.createProduct:
          return new CreateProductTask(taskKind) as unknown as DependentTask<TKind, unknown, TArgs, TReturn>;
        case TaskKindType.createUser:
          return new CreateUserTask(taskKind) as unknown as DependentTask<TKind, unknown, TArgs, TReturn>;
      }
    } else {
      throw new Error('Task kind not supported');
    }
  }
}
```
