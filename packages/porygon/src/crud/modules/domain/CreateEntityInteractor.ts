import { CreateAdapter } from '../../adapter/domain/CreateAdapter';
import { Interactor } from './Interactor';

export class CreateEntityInteractor<TModel, TQuery>
  implements Interactor<TQuery, TModel>
{
  readonly #insertAdapter: CreateAdapter<TModel, TQuery>;

  constructor(insertAdapter: CreateAdapter<TModel, TQuery>) {
    this.#insertAdapter = insertAdapter;
  }

  public async interact(query: TQuery): Promise<TModel> {
    return this.#insertAdapter.insertOne(query);
  }
}
