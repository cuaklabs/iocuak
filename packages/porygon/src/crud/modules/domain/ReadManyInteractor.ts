import { FindAdapter } from '../../adapter/domain/FindAdapter';
import { Interactor } from './Interactor';

export class ReadManyInteractor<TModel, TQuery>
  implements Interactor<TQuery, TModel[]>
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
