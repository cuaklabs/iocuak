import { DeleteEntityPort } from '../../port/application/DeleteEntityPort';
import { InteractorAsync } from './InteractorAsync';

export class DeleteEntityInteractor<TCommand>
  implements InteractorAsync<TCommand, void>
{
  readonly #deleteAdapter: DeleteEntityPort<TCommand>;

  constructor(deleteAdapter: DeleteEntityPort<TCommand>) {
    this.#deleteAdapter = deleteAdapter;
  }

  public async interact(command: TCommand): Promise<void> {
    await this.#deleteAdapter.delete(command);
  }
}
