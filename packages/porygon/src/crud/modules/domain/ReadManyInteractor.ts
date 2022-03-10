import { FindAdapter } from '../../adapter/domain/FindAdapter';
import { Interactor } from './Interactor';

export class ReadManyInteractor<TModel, TQuery>
  implements Interactor<TQuery, TModel[]>
{
  constructor(private readonly findAdapter: FindAdapter<TModel, TQuery>) {}

  public async interact(query: TQuery): Promise<TModel[]> {
    const models: TModel[] = await this.findAdapter.find(query);

    return models;
  }
}
