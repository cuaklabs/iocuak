import { InteractorAsync } from '../../../common/modules/domain/InteractorAsync';
import { FindEntityPort } from '../../port/application/FindEntityPort';

export class ReadManyEntityInteractor<TModel, TQuery>
  implements InteractorAsync<TQuery, TModel[]>
{
  readonly #findAdapter: FindEntityPort<TModel, TQuery>;

  constructor(findAdapter: FindEntityPort<TModel, TQuery>) {
    this.#findAdapter = findAdapter;
  }

  public async interact(query: TQuery): Promise<TModel[]> {
    const models: TModel[] = await this.#findAdapter.find(query);

    return models;
  }
}
