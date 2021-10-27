# About task dependency engines

⚠️ This module probably determines how friendly is your task manager.

This module takes the responsability of providing task kind dependencies given a task kind. You migh discover your task kinds requires additional stuff to provide task dependencies at this point 💩.

**Example:**

Alice, our brave hero, is implementing the task dependency engine. She already implemented some task kinds:

**Disclaimer** ⚠️: This is not a real-world implementation. Alice may need to take architecture deccissions such as adding an extra layer to properly model queries.

```ts
import { UseCase } from 'some/path';

enum TaskKindType {
  createUser = 'createUser',
  createProduct = 'createProduct',
}

interface CreateProductTaskKind {
  type: TaskKindType.createProduct;
  useCase: UseCase;
}

interface CreateUserTaskKind {
  type: TaskKindType.createUser;
  useCase: UseCase;
}

type TaskKind = CreateProductTaskKind | CreateUserTaskKind;

```

Now, a possible task kind engine could be:

```ts
import { TaskDependencyEngine } from '@cuaklabs/cuaktask';

import {
  CreateProductTaskKind,
  CreateUserTaskKind,
  TaskKind
} from 'some/path';

class EnvSetupTaskDependencyEngine implements TaskDependencyEngine {
  public getDependencies<TKind, TDependencyKind>(
    taskKind: TKind,
  ): TDependencyKind[] {
    if (isTaskKind(taskKind)) {
      let dependencies: TDependencyKind[];

      switch (taskKind.type) {
        case TaskKindType.createProduct:
          dependencies = this.#getCreateProductTaskKindDependencies(
            taskKind,
          ) as unknown[] as TDependencyKind[];
          break;
        case TaskKindType.createUser:
          dependencies = this.#getCreateUserTaskKindDependencies(
            taskKind,
          ) as unknown[] as TDependencyKind[];
          break;
      }

      return dependencies;
    } else {
      throw new Error('task kind not supported');
    }
  }

  #getCreateProductTaskKindDependencies(
    taskKind: CreateProductTaskKind,
  ): TaskKind[] {
    const createUserTaskKind: CreateUserTaskKind = {
      type: TaskKindType.createUser,
      useCase: taskKind.useCase,
    }

    return [createUserTaskKind];
  }

  #getCreateUserTaskKindDependencies(
    taskKind: CreateUserTaskKind,
  ): TaskKind[] {
    return [];
  }
}

```

Once the task dependency engine is ready, the [task builder](./5-about-task-builders) is the next module to extend
