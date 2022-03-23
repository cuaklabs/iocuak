import { InteractorAsync } from '../../../common/modules/domain/InteractorAsync';
import { UpdateEntityPort } from '../../port/application/UpdateEntityPort';

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
