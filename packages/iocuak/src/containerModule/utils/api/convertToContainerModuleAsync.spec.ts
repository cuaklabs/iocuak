import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./convertToContainerModule');

import { convertToContainerModule } from '../../../containerModule/utils/api/convertToContainerModule';
import { convertToContainerModuleAsync } from '../../../containerModule/utils/api/convertToContainerModuleAsync';
import { ContainerModuleApi } from '../../models/api/ContainerModuleApi';

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
