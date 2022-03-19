import { FindEntityPort } from '../../port/application/FindEntityPort';
import { InteractorAsync } from './InteractorAsync';

export class ReadOneEntityInteractor<TModel, TQuery>
  implements InteractorAsync<TQuery, TModel | undefined>
{
  readonly #findAdapter: FindEntityPort<TModel, TQuery>;

  constructor(findAdapter: FindEntityPort<TModel, TQuery>) {
    this.#findAdapter = findAdapter;
  }

  public async interact(query: TQuery): Promise<TModel | undefined> {
    const modelOrUndefined: TModel | undefined =
      await this.#findAdapter.findOne(query);

    return modelOrUndefined;
  }
}
