import { FindAdapter } from '../../adapter/domain/FindAdapter';
import { Interactor } from './Interactor';

export class ReadOneInteractor<TModel, TQuery>
  implements Interactor<TQuery, TModel | undefined>
{
  readonly #findAdapter: FindAdapter<TModel, TQuery>;

  constructor(findAdapter: FindAdapter<TModel, TQuery>) {
    this.#findAdapter = findAdapter;
  }

  public async interact(query: TQuery): Promise<TModel | undefined> {
    const modelOrUndefined: TModel | undefined =
      await this.#findAdapter.findOne(query);

    return modelOrUndefined;
  }
}
