import { SetLike } from '@cuaklabs/cuaktask';

import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
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
    return this.#traverseTaskKindMap(
      elem,
      (key: unknown, map: Map<unknown, TaskKind> | undefined) => {
        (map as Map<unknown, TaskKind>).set(key, elem);

        return this;
      },
      true,
    );
  }

  public clear(): void {
    this.#innerTaskKindMap.clear();
  }

  public delete(elem: TaskKind): boolean {
    return this.#traverseTaskKindMap(
      elem,
      (key: unknown, map: Map<unknown, TaskKind> | undefined) => {
        if (map === undefined) {
          return false;
        }

        return map.delete(key);
      },
      false,
    );
  }

  public has(elem: TaskKind): boolean {
    return this.#traverseTaskKindMap(
      elem,
      (key: unknown, map: Map<unknown, TaskKind> | undefined) => {
        if (map === undefined) {
          return false;
        }

        return map.has(key);
      },
      false,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #traverseTaskKindMap<TReturn>(
    elem: TaskKind,
    action: (key: unknown, map: Map<unknown, TaskKind> | undefined) => TReturn,
    buildLeafNodes: boolean,
  ): TReturn {
    let taskKindTypeToTaskScopeToTaskKindMapMap:
      | Map<
          TaskKindType,
          Map<
            TaskScope,
            CreateInstanceTaskKind | GetInstanceDependenciesTaskKind
          >
        >
      | undefined = this.#innerTaskKindMap.get(elem.id);

    if (
      buildLeafNodes &&
      taskKindTypeToTaskScopeToTaskKindMapMap === undefined
    ) {
      taskKindTypeToTaskScopeToTaskKindMapMap = new Map();

      this.#innerTaskKindMap.set(
        elem.id,
        taskKindTypeToTaskScopeToTaskKindMapMap,
      );
    }

    let taskScopeToTaskKindMap:
      | Map<TaskScope, CreateInstanceTaskKind>
      | undefined;

    if (taskKindTypeToTaskScopeToTaskKindMapMap !== undefined) {
      taskScopeToTaskKindMap = taskKindTypeToTaskScopeToTaskKindMapMap.get(
        elem.type,
      ) as Map<TaskScope, CreateInstanceTaskKind> | undefined;

      if (buildLeafNodes && taskScopeToTaskKindMap === undefined) {
        taskScopeToTaskKindMap = new Map();

        taskKindTypeToTaskScopeToTaskKindMapMap.set(
          elem.type,
          taskScopeToTaskKindMap,
        );
      }
    }

    return action(elem.scope, taskScopeToTaskKindMap);
  }
}
