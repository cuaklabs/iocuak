import { SetLike } from '@cuaklabs/cuaktask';

import { ServiceId } from '../../common/models/domain/ServiceId';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export class TaskKindSet implements SetLike<TaskKind> {
  readonly #innerTaskKindMap: Map<ServiceId, Map<TaskKindType, TaskKind>>;

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

  #traverseTaskKindMap<TReturn>(
    elem: TaskKind,
    action: (key: unknown, map: Map<unknown, TaskKind> | undefined) => TReturn,
    buildLeafNodes: boolean,
  ): TReturn {
    let taskKindTypeToTaskKindMap: Map<TaskKindType, TaskKind> | undefined =
      this.#innerTaskKindMap.get(elem.id);

    if (buildLeafNodes && taskKindTypeToTaskKindMap === undefined) {
      taskKindTypeToTaskKindMap = new Map();

      this.#innerTaskKindMap.set(elem.id, taskKindTypeToTaskKindMap);
    }

    return action(elem.type, taskKindTypeToTaskKindMap);
  }
}
