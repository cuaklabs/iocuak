import { FindAdapter } from '../../adapter/domain/FindAdapter';
import { InteractorAsync } from './InteractorAsync';

export class ReadManyEntityInteractor<TModel, TQuery>
  implements InteractorAsync<TQuery, TModel[]>
{
  readonly #findAdapter: FindAdapter<TModel, TQuery>;

  constructor(findAdapter: FindAdapter<TModel, TQuery>) {
    this.#findAdapter = findAdapter;
  }

  public async interact(query: TQuery): Promise<TModel[]> {
    const models: TModel[] = await this.#findAdapter.find(query);

    return models;
  }
}
