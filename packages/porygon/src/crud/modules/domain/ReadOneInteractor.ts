import { FindAdapter } from '../../adapter/domain/FindAdapter';
import { Interactor } from './Interactor';

export class ReadOneInteractor<TModel, TQuery>
  implements Interactor<TQuery, TModel | undefined>
{
  constructor(private readonly findAdapter: FindAdapter<TModel, TQuery>) {}

  public async interact(query: TQuery): Promise<TModel | undefined> {
    const modelOrUndefined: TModel | undefined = await this.findAdapter.findOne(
      query,
    );

    return modelOrUndefined;
  }
}
