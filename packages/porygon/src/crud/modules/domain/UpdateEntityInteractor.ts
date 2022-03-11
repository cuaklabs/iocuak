import { UpdateAdapter } from '../../adapter/domain/UpdateAdapter';
import { Interactor } from './Interactor';

export class UpdateEntityInteractor<TCommand>
  implements Interactor<TCommand, void>
{
  readonly #updateAdapter: UpdateAdapter<TCommand>;

  constructor(updateAdapter: UpdateAdapter<TCommand>) {
    this.#updateAdapter = updateAdapter;
  }

  public async interact(command: TCommand): Promise<void> {
    await this.#updateAdapter.update(command);
  }
}
