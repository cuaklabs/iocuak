import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('../../../container/utils/bind');
jest.mock('../../../container/utils/bindToValue');

import { Newable, ServiceId, Tag } from '@cuaklabs/iocuak-common';
import { BindingService, ContainerModule } from '@cuaklabs/iocuak-core';

import { ContainerModuleBindingServiceApi } from '../../../container/services/api/ContainerModuleBindingServiceApi';
import { bind } from '../../../container/utils/bind';
import { bindToValue } from '../../../container/utils/bindToValue';
import { ContainerModuleApi } from '../../models/api/ContainerModuleApi';
import { convertToContainerModule } from './convertToContainerModule';

describe(convertToContainerModule.name, () => {
  let containerModuleApiMock: jestMock.Mocked<ContainerModuleApi>;

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
      let containerBindingServiceFixture: BindingService;

      beforeAll(() => {
        containerBindingServiceFixture = {
          _tag: 'containerBindingService',
        } as unknown as BindingService;

        (result as ContainerModule).load(containerBindingServiceFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleApi.load()', () => {
        const expected: ContainerModuleBindingServiceApi = {
          bind: expect.any(
            Function,
          ) as unknown as ContainerModuleBindingServiceApi['bind'],
          bindToValue: expect.any(
            Function,
          ) as unknown as ContainerModuleBindingServiceApi['bindToValue'],
        };

        expect(containerModuleApiMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleApiMock.load).toHaveBeenCalledWith(expected);
      });
    });

    describe('when result.load() is called and containerModuleApi.load() calls containerModuleBindingServiceApi.bind()', () => {
      let typeFixture: Newable;
      let containerBindingServiceFixture: BindingService;

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
        } as Partial<BindingService> as BindingService;

        (result as ContainerModule).load(containerBindingServiceFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleApi.load()', () => {
        const expected: ContainerModuleBindingServiceApi = {
          bind: expect.any(
            Function,
          ) as unknown as ContainerModuleBindingServiceApi['bind'],
          bindToValue: expect.any(
            Function,
          ) as unknown as ContainerModuleBindingServiceApi['bindToValue'],
        };

        expect(containerModuleApiMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleApiMock.load).toHaveBeenCalledWith(expected);
      });

      it('should call bind', () => {
        expect(bind).toHaveBeenCalledTimes(1);
        expect(bind).toHaveBeenCalledWith(
          typeFixture,
          containerBindingServiceFixture,
        );
      });
    });

    describe('when result.load() is called and containerModuleApi.load() calls containerModuleBindingServiceApi.bindToValue()', () => {
      let serviceIdFixture: ServiceId;
      let tagsFixture: Tag[];
      let valueFixture: unknown;
      let containerBindingServiceFixture: BindingService;

      beforeAll(() => {
        serviceIdFixture = Symbol();
        tagsFixture = [Symbol()];
        valueFixture = Symbol();

        containerModuleApiMock.load.mockImplementationOnce(
          (
            containerModuleBindingService: ContainerModuleBindingServiceApi,
          ): void => {
            containerModuleBindingService.bindToValue({
              serviceId: serviceIdFixture,
              tags: tagsFixture,
              value: valueFixture,
            });
          },
        );

        containerBindingServiceFixture = {
          _tag: 'containerBindingService',
        } as Partial<BindingService> as BindingService;

        (result as ContainerModule).load(containerBindingServiceFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleApi.load()', () => {
        const expected: ContainerModuleBindingServiceApi = {
          bind: expect.any(
            Function,
          ) as unknown as ContainerModuleBindingServiceApi['bind'],
          bindToValue: expect.any(
            Function,
          ) as unknown as ContainerModuleBindingServiceApi['bindToValue'],
        };

        expect(containerModuleApiMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleApiMock.load).toHaveBeenCalledWith(expected);
      });

      it('should call bindToValue', () => {
        expect(bindToValue).toHaveBeenCalledTimes(1);
        expect(bindToValue).toHaveBeenCalledWith(
          serviceIdFixture,
          tagsFixture,
          valueFixture,
          containerBindingServiceFixture,
        );
      });
    });
  });
});
