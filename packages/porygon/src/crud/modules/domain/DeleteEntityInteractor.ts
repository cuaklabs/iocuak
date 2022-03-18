import { DeleteAdapter } from '../../adapter/domain/DeleteAdapter';
import { InteractorAsync } from './InteractorAsync';

export class DeleteEntityInteractor<TCommand>
  implements InteractorAsync<TCommand, void>
{
  readonly #deleteAdapter: DeleteAdapter<TCommand>;

  constructor(deleteAdapter: DeleteAdapter<TCommand>) {
    this.#deleteAdapter = deleteAdapter;
  }

  public async interact(command: TCommand): Promise<void> {
    await this.#deleteAdapter.delete(command);
  }
}
