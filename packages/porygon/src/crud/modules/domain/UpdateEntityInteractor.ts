import { UpdateEntityPort } from '../../port/application/UpdateEntityPort';
import { InteractorAsync } from './InteractorAsync';

export class UpdateEntityInteractor<TCommand>
  implements InteractorAsync<TCommand, void>
{
  readonly #updateAdapter: UpdateEntityPort<TCommand>;

  constructor(updateAdapter: UpdateEntityPort<TCommand>) {
    this.#updateAdapter = updateAdapter;
  }

  public async interact(command: TCommand): Promise<void> {
    await this.#updateAdapter.update(command);
  }
}
