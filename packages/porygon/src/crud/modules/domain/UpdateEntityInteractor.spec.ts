import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { UpdateEntityPort } from '../../port/application/UpdateEntityPort';
import { UpdateEntityInteractor } from './UpdateEntityInteractor';

interface CommandTest {
  fooValue: unknown;
}

describe(UpdateEntityInteractor.name, () => {
  let updateAdapterMock: jestMock.Mocked<UpdateEntityPort<CommandTest>>;
  let updateInteractor: UpdateEntityInteractor<CommandTest>;

  beforeAll(() => {
    updateAdapterMock = {
      update: jest.fn(),
    } as Partial<
      jestMock.Mocked<UpdateEntityPort<CommandTest>>
    > as jestMock.Mocked<UpdateEntityPort<CommandTest>>;

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
