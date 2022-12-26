import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../binding/utils/domain/bind');
jest.mock('../../../binding/utils/domain/bindToValue');

import { Newable, Tag } from '@cuaklabs/iocuak-common';
import { BindingService, ContainerModule } from '@cuaklabs/iocuak-core';

import { BindOptionsFixtures } from '../../../binding/fixtures/domain/BindOptionsFixtures';
import { bind } from '../../../binding/utils/domain/bind';
import { bindToValue } from '../../../binding/utils/domain/bindToValue';
import { BindValueOptionsApi } from '../../../container/models/api/BindValueOptionsApi';
import { ContainerModuleBindingServiceApi } from '../../../container/services/api/ContainerModuleBindingServiceApi';
import { ContainerModuleApi } from '../../models/api/ContainerModuleApi';
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
          BindOptionsFixtures.withScopeUndefined,
          containerBindingServiceFixture,
        );
      });
    });

    describe.each<[string, BindValueOptionsApi, Tag[]]>([
      [
        'BindValueOptionsApi with no tags',
        {
          serviceId: Symbol(),
          value: Symbol(),
        },
        [],
      ],
      [
        'BindValueOptionsApi with tag empty array',
        {
          serviceId: Symbol(),
          tags: [],
          value: Symbol(),
        },
        [],
      ],
      [
        'BindValueOptionsApi with tag array with elements',
        {
          serviceId: Symbol(),
          tags: ['tag-sample'],
          value: Symbol(),
        },
        ['tag-sample'],
      ],
      [
        'BindValueOptionsApi with tag element',
        {
          serviceId: Symbol(),
          tags: 'tag-sample',
          value: Symbol(),
        },
        ['tag-sample'],
      ],
    ])(
      'having a %s',
      (
        _: string,
        bindValueOptionsApiFixture: BindValueOptionsApi,
        expectedTagsFixture: Tag[],
      ) => {
        describe('when result.load() is called and containerModuleApi.load() calls containerModuleBindingServiceApi.bindToValue()', () => {
          let containerBindingServiceFixture: BindingService;

          beforeAll(() => {
            containerModuleApiMock.load.mockImplementationOnce(
              (
                containerModuleBindingService: ContainerModuleBindingServiceApi,
              ): void => {
                containerModuleBindingService.bindToValue(
                  bindValueOptionsApiFixture,
                );
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
              bindValueOptionsApiFixture.serviceId,
              expectedTagsFixture,
              bindValueOptionsApiFixture.value,
              containerBindingServiceFixture,
            );
          });
        });
      },
    );
  });
});
