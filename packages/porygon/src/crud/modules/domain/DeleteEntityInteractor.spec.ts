import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { DeleteEntityPort } from '../../port/application/DeleteEntityPort';
import { DeleteEntityInteractor } from './DeleteEntityInteractor';

interface CommandTest {
  fooValue: unknown;
}

describe(DeleteEntityInteractor.name, () => {
  let deleteAdapterMock: jestMock.Mocked<DeleteEntityPort<CommandTest>>;
  let deleteEntityInteractor: DeleteEntityInteractor<CommandTest>;

  beforeAll(() => {
    deleteAdapterMock = {
      delete: jest.fn(),
    } as Partial<
      jestMock.Mocked<DeleteEntityPort<CommandTest>>
    > as jestMock.Mocked<DeleteEntityPort<CommandTest>>;
    deleteEntityInteractor = new DeleteEntityInteractor(deleteAdapterMock);
  });

  describe('.interact()', () => {
    describe('when called', () => {
      let commandFixture: CommandTest;

      beforeAll(async () => {
        commandFixture = { fooValue: 'bar' };

        await deleteEntityInteractor.interact(commandFixture);
      });
      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call deleteAdapter.delete()', () => {
        expect(deleteAdapterMock.delete).toHaveBeenCalledTimes(1);
        expect(deleteAdapterMock.delete).toHaveBeenCalledWith(commandFixture);
      });
    });
  });
});
