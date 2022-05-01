jest.mock('../../../container/utils/bind');
jest.mock('../../../container/utils/bindToValue');

import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleBindingServiceApi } from '../../../container/services/api/ContainerModuleBindingServiceApi';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { bind } from '../../../container/utils/bind';
import { bindToValue } from '../../../container/utils/bindToValue';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleApi } from '../../models/api/ContainerModuleApi';
import { ContainerModule } from '../../models/domain/ContainerModule';
import { convertToContainerModule } from './convertToContainerModule';

describe(convertToContainerModule.name, () => {
  let containerModuleApiMock: jest.Mocked<ContainerModuleApi>;

  beforeAll(() => {
    containerModuleApiMock = {
      load: jest.fn(),
    };
  });

  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = convertToContainerModule(containerModuleApiMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a ContainerModule', () => {
      expect((result as ContainerModule).load).toBeInstanceOf(Function);
    });

    describe('when result.load() is called', () => {
      let containerBindingServiceFixture: ContainerBindingService;
      let metadataServiceFixture: MetadataService;

      beforeAll(() => {
        containerBindingServiceFixture = {
          _tag: 'containerBindingService',
        } as unknown as ContainerBindingService;

        metadataServiceFixture = {
          _tag: 'metadataServiceFixture',
        } as unknown as MetadataService;

        (result as ContainerModule).load(
          containerBindingServiceFixture,
          metadataServiceFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleApi.load()', () => {
        const expected: ContainerModuleBindingServiceApi = {
          bind: expect.any(
            Function,
          ) as ContainerModuleBindingServiceApi['bind'],
          bindToValue: expect.any(
            Function,
          ) as ContainerModuleBindingServiceApi['bindToValue'],
        };

        expect(containerModuleApiMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleApiMock.load).toHaveBeenCalledWith(expected);
      });
    });

    describe('when result.load() is called and containerModuleApi.load() calls containerModuleBindingServiceApi.bind()', () => {
      let typeFixture: Newable;
      let containerBindingServiceFixture: ContainerBindingService;
      let metadataServiceFixture: MetadataService;

      beforeAll(() => {
        typeFixture = class {};
        containerModuleApiMock.load.mockImplementationOnce(
          (
            containerModuleBindingService: ContainerModuleBindingServiceApi,
          ): void => {
            containerModuleBindingService.bind(typeFixture);
          },
        );

        containerBindingServiceFixture = {
          _tag: 'containerBindingService',
        } as Partial<ContainerBindingService> as ContainerBindingService;

        metadataServiceFixture = {
          _tag: 'metadataServiceFixture',
        } as unknown as MetadataService;

        (result as ContainerModule).load(
          containerBindingServiceFixture,
          metadataServiceFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleApi.load()', () => {
        const expected: ContainerModuleBindingServiceApi = {
          bind: expect.any(
            Function,
          ) as ContainerModuleBindingServiceApi['bind'],
          bindToValue: expect.any(
            Function,
          ) as ContainerModuleBindingServiceApi['bindToValue'],
        };

        expect(containerModuleApiMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleApiMock.load).toHaveBeenCalledWith(expected);
      });

      it('should call bind', () => {
        expect(bind).toHaveBeenCalledTimes(1);
        expect(bind).toHaveBeenCalledWith(
          typeFixture,
          containerBindingServiceFixture,
          metadataServiceFixture,
        );
      });
    });

    describe('when result.load() is called and containerModuleApi.load() calls containerModuleBindingServiceApi.bindToValue()', () => {
      let serviceIdFixture: ServiceId;
      let valueFixture: unknown;
      let containerBindingServiceFixture: ContainerBindingService;
      let metadataServiceFixture: MetadataService;

      beforeAll(() => {
        serviceIdFixture = Symbol();
        valueFixture = Symbol();

        containerModuleApiMock.load.mockImplementationOnce(
          (
            containerModuleBindingService: ContainerModuleBindingServiceApi,
          ): void => {
            containerModuleBindingService.bindToValue(
              serviceIdFixture,
              valueFixture,
            );
          },
        );

        containerBindingServiceFixture = {
          _tag: 'containerBindingService',
        } as Partial<ContainerBindingService> as ContainerBindingService;

        metadataServiceFixture = {
          _tag: 'metadataServiceFixture',
        } as unknown as MetadataService;

        (result as ContainerModule).load(
          containerBindingServiceFixture,
          metadataServiceFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleApi.load()', () => {
        const expected: ContainerModuleBindingServiceApi = {
          bind: expect.any(
            Function,
          ) as ContainerModuleBindingServiceApi['bind'],
          bindToValue: expect.any(
            Function,
          ) as ContainerModuleBindingServiceApi['bindToValue'],
        };

        expect(containerModuleApiMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleApiMock.load).toHaveBeenCalledWith(expected);
      });

      it('should call bindToValue', () => {
        expect(bindToValue).toHaveBeenCalledTimes(1);
        expect(bindToValue).toHaveBeenCalledWith(
          serviceIdFixture,
          valueFixture,
          containerBindingServiceFixture,
        );
      });
    });
  });
});
