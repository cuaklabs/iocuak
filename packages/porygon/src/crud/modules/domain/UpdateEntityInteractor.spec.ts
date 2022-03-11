import { UpdateAdapter } from '../../adapter/domain/UpdateAdapter';
import { UpdateEntityInteractor } from './UpdateEntityInteractor';

interface CommandTest {
  fooValue: unknown;
}

describe(UpdateEntityInteractor.name, () => {
  let updateAdapterMock: jest.Mocked<UpdateAdapter<CommandTest>>;
  let updateInteractor: UpdateEntityInteractor<CommandTest>;

  beforeAll(() => {
    updateAdapterMock = {
      update: jest.fn(),
    } as Partial<jest.Mocked<UpdateAdapter<CommandTest>>> as jest.Mocked<
      UpdateAdapter<CommandTest>
    >;

    updateInteractor = new UpdateEntityInteractor(updateAdapterMock);
  });

  describe('.interact()', () => {
    describe('when called', () => {
      let commandFixture: CommandTest;

      beforeAll(async () => {
        commandFixture = { fooValue: 'bar' };

        await updateInteractor.interact(commandFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call updateAdapter.update()', () => {
        expect(updateAdapterMock.update).toHaveBeenCalledTimes(1);
        expect(updateAdapterMock.update).toHaveBeenCalledWith(commandFixture);
      });
    });
  });
});
