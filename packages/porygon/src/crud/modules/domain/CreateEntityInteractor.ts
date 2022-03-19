import { InteractorAsync } from '../../../common/modules/domain/InteractorAsync';
import { CreateEntityPort } from '../../port/application/CreateEntityPort';

export class CreateEntityInteractor<TModel, TQuery>
  implements InteractorAsync<TQuery, TModel>
{
  readonly #insertAdapter: CreateEntityPort<TModel, TQuery>;

  constructor(insertAdapter: CreateEntityPort<TModel, TQuery>) {
    this.#insertAdapter = insertAdapter;
  }

  public async interact(query: TQuery): Promise<TModel> {
    return this.#insertAdapter.insertOne(query);
  }
}
