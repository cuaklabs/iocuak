import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingScope } from '../../../binding/models/domain/BindingScope';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { GetCachedInstanceTaskKind } from '../domain/GetCachedInstanceTaskKind';

export class GetCachedInstanceTask extends cuaktask.BaseTask<
  GetCachedInstanceTaskKind,
  [],
  unknown
> {
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;

  constructor(
    taskKind: GetCachedInstanceTaskKind,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
    super(taskKind);

    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
  }

  protected innerPerform(): unknown {
    let result: unknown;

    switch (this.kind.binding.scope) {
      case BindingScope.request:
        result = this.#getCachedInstanceFromRequestScope();
        break;
      case BindingScope.singleton:
        result = this.#getCachedInstanceFromSingletonScope();
        break;
      case BindingScope.transient:
        result = undefined;
        break;
    }

    if (result === undefined) {
      this._setErrorStatus();
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #getCachedInstanceFromRequestScope(): unknown {
    return this.#containerRequestService.get(
      this.kind.requestId,
      this.kind.binding.id,
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #getCachedInstanceFromSingletonScope(): unknown {
    return this.#containerSingletonService.get(this.kind.binding.id);
  }
}
