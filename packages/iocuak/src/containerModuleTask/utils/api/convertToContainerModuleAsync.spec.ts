jest.mock('./convertToContainerModule');

import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';
import { convertToContainerModule } from './convertToContainerModule';
import { convertToContainerModuleAsync } from './convertToContainerModuleAsync';

describe(convertToContainerModuleAsync.name, () => {
  describe('when called', () => {
    let containerModuleApiFixture: ContainerModuleApi;

    beforeAll(async () => {
      containerModuleApiFixture = {
        _tag: 'containerModuleApiFixture',
      } as unknown as ContainerModuleApi;

      await convertToContainerModuleAsync(
        Promise.resolve(containerModuleApiFixture),
      );
    });

    it('should call convertToContainerModule()', () => {
      expect(convertToContainerModule).toHaveBeenCalledTimes(1);
      expect(convertToContainerModule).toHaveBeenCalledWith(
        containerModuleApiFixture,
      );
    });
  });
});
