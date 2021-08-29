import { SetLike } from '@cuaklabs/cuaktask';

import { TaskId } from '../models/domain/TaskId';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { TaskScope } from '../models/domain/TaskScope';

export class TaskKindSet implements SetLike<TaskKind> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #innerTaskKindMap: Map<
    TaskId,
    Map<TaskKindType, Map<TaskScope, TaskKind>>
  >;

  constructor() {
    this.#innerTaskKindMap = new Map();
  }

  public add(elem: TaskKind): this {
    let taskKindTypeToTaskScopeToTaskKindMapMap:
      | Map<TaskKindType, Map<TaskScope, TaskKind>>
      | undefined = this.#innerTaskKindMap.get(elem.id);

    if (taskKindTypeToTaskScopeToTaskKindMapMap === undefined) {
      taskKindTypeToTaskScopeToTaskKindMapMap = new Map();

      this.#innerTaskKindMap.set(
        elem.id,
        taskKindTypeToTaskScopeToTaskKindMapMap,
      );
    }

    let taskScopeToTaskKindMap: Map<TaskScope, TaskKind> | undefined =
      taskKindTypeToTaskScopeToTaskKindMapMap.get(elem.type);

    if (taskScopeToTaskKindMap === undefined) {
      taskScopeToTaskKindMap = new Map();

      taskKindTypeToTaskScopeToTaskKindMapMap.set(
        elem.type,
        taskScopeToTaskKindMap,
      );
    }

    taskScopeToTaskKindMap.set(elem.scope, elem);

    return this;
  }

  public clear(): void {
    this.#innerTaskKindMap.clear();
  }

  public delete(elem: TaskKind): boolean {
    const taskScopeToTaskKindMap: Map<TaskScope, TaskKind> | undefined =
      this.#getTaskScopeToTaskKindMap(elem);

    if (taskScopeToTaskKindMap === undefined) {
      return false;
    }

    return taskScopeToTaskKindMap.delete(elem.scope);
  }

  public has(elem: TaskKind): boolean {
    const taskScopeToTaskKindMap: Map<TaskScope, TaskKind> | undefined =
      this.#getTaskScopeToTaskKindMap(elem);

    if (taskScopeToTaskKindMap === undefined) {
      return false;
    }

    return taskScopeToTaskKindMap.has(elem.scope);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #getTaskScopeToTaskKindMap(
    elem: TaskKind,
  ): Map<TaskScope, TaskKind> | undefined {
    const taskKindTypeToTaskScopeToTaskKindMapMap:
      | Map<TaskKindType, Map<TaskScope, TaskKind>>
      | undefined = this.#innerTaskKindMap.get(elem.id);

    let taskScopeToTaskKindMap: Map<TaskScope, TaskKind> | undefined;

    if (taskKindTypeToTaskScopeToTaskKindMapMap !== undefined) {
      taskScopeToTaskKindMap = taskKindTypeToTaskScopeToTaskKindMapMap.get(
        elem.type,
      );
    }

    return taskScopeToTaskKindMap;
  }
}
