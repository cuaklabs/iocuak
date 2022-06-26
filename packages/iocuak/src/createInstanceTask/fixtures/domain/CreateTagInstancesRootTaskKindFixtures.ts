import { CreateTagInstancesRootTaskKind } from '../../models/domain/CreateTagInstancesRootTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateTagInstancesRootTaskKindFixtures {
  static readonly #requestId: symbol = Symbol();
  static readonly #tag: symbol = Symbol();

  public static get any(): CreateTagInstancesRootTaskKind {
    const fixture: CreateTagInstancesRootTaskKind = {
      requestId: CreateTagInstancesRootTaskKindFixtures.#requestId,
      tag: CreateTagInstancesRootTaskKindFixtures.#tag,
      type: TaskKindType.createTagInstancesRoot,
    };

    return fixture;
  }
}
