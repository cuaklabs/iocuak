import { UpdateAdapter } from '../../adapter/domain/UpdateAdapter';
import { InteractorAsync } from './InteractorAsync';

export class UpdateEntityInteractor<TCommand>
  implements InteractorAsync<TCommand, void>
{
  readonly #updateAdapter: UpdateAdapter<TCommand>;

  constructor(updateAdapter: UpdateAdapter<TCommand>) {
    this.#updateAdapter = updateAdapter;
  }

  public async interact(command: TCommand): Promise<void> {
    await this.#updateAdapter.update(command);
  }
}
