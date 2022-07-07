import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('../../../containerModule/utils/api/convertToContainerModule');
jest.mock('../../../containerModule/utils/api/convertToContainerModuleAsync');

import { BindingService } from '../../../binding/services/domain/BindingService';
import { ClassElementMetadata } from '../../../classMetadata/models/domain/ClassElementMetadata';
import { ClassElementMetadataType } from '../../../classMetadata/models/domain/ClassElementMetadataType';
import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { convertToContainerModule } from '../../../containerModule/utils/api/convertToContainerModule';
import { convertToContainerModuleAsync } from '../../../containerModule/utils/api/convertToContainerModuleAsync';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleMetadataApiMocks } from '../../mocks/models/api/ContainerModuleMetadataApiMocks';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleClassMetadata } from '../../models/domain/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../../models/domain/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../models/domain/ContainerModuleMetadataType';
import { convertToContainerModuleMetadata } from './convertToContainerModuleMetadata';

describe(convertToContainerModuleMetadata.name, () => {
  describe('having a ContainerModuleApi', () => {
    let containerModuleFactoryMetadataApiMock: jestMock.Mocked<ContainerModuleApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock = {
        load: jest.fn(),
      };
    });

    describe('when called', () => {
      let containerModuleMetadata: ContainerModuleFactoryMetadata;
      let result: unknown;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleFactoryMetadataApiMock,
        );

        containerModuleMetadata = result as ContainerModuleFactoryMetadata;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleFactoryMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          imports: [],
          injects: [],
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });

      describe('when factory is called and containerModuleMetadataApi.factory returns a non promise', () => {
        let containerModuleFixture: ContainerModule;
        let argumentsFixture: unknown[];
        let result: unknown;

        beforeAll(() => {
          containerModuleFixture = {
            _tag: 'containerModule',
          } as unknown as ContainerModule;

          (
            convertToContainerModule as jestMock.Mock<
              typeof convertToContainerModule
            >
          ).mockReturnValueOnce(containerModuleFixture);

          argumentsFixture = [Symbol()];

          result = containerModuleMetadata.factory(...argumentsFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call convertToContainerModule()', () => {
          expect(convertToContainerModule).toHaveBeenCalledTimes(1);
          expect(convertToContainerModule).toHaveBeenCalledWith(
            containerModuleFactoryMetadataApiMock,
          );
        });

        it('should return a ContainerModule', () => {
          expect(result).toBe(containerModuleFixture);
        });
      });
    });
  });

  describe('having a ContainerModuleApi Newable', () => {
    let containerModuleClassMetadataApiMock: jestMock.Mocked<
      Newable<ContainerModuleApi> & jestMock.FunctionLike
    >;

    beforeAll(() => {
      containerModuleClassMetadataApiMock = jest.fn() as jestMock.Mocked<
        Newable<ContainerModuleApi> & jestMock.FunctionLike
      >;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleClassMetadataApiMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleClassMetadata = {
          imports: [],
          loader: expect.any(
            Function,
          ) as unknown as ContainerModuleClassMetadata['loader'],
          moduleType: containerModuleClassMetadataApiMock,
          type: ContainerModuleMetadataType.clazz,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleClassMetadataApi', () => {
    let containerModuleClassMetadataApiMock: jestMock.Mocked<ContainerModuleClassMetadataApi>;

    beforeAll(() => {
      containerModuleClassMetadataApiMock =
        ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi;
    });

    describe('when called', () => {
      let result: unknown;
      let containerModuleMetadata: ContainerModuleClassMetadata;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleClassMetadataApiMock,
        );

        containerModuleMetadata = result as ContainerModuleClassMetadata;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleClassMetadata = {
          imports: expect.any(Array) as unknown as ContainerModuleMetadata[],
          loader: expect.any(
            Function,
          ) as unknown as ContainerModuleClassMetadata['loader'],
          moduleType: containerModuleClassMetadataApiMock.module,
          type: ContainerModuleMetadataType.clazz,
        };

        expect(result).toStrictEqual(expected);
      });

      describe('when loader is called', () => {
        let containerModuleMock: jestMock.Mocked<ContainerModule>;
        let containerModuleApiFixture: ContainerModuleApi;
        let containerBindingServiceFixture: BindingService;
        let metadataServiceFixture: MetadataService;

        beforeAll(() => {
          containerModuleMock = {
            load: jest.fn(),
          };

          containerModuleApiFixture = {
            _tag: Symbol('ContainerModuleApi'),
          } as Partial<ContainerModuleApi> as ContainerModuleApi;

          containerBindingServiceFixture = {
            _tag: Symbol('ContainerBindingService'),
          } as Partial<BindingService> as BindingService;

          metadataServiceFixture = {
            _tag: Symbol('MetadataService'),
          } as Partial<MetadataService> as MetadataService;

          (
            convertToContainerModule as jestMock.Mock<
              typeof convertToContainerModule
            >
          ).mockReturnValueOnce(containerModuleMock);

          containerModuleMetadata.loader(
            containerModuleApiFixture,
            containerBindingServiceFixture,
            metadataServiceFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call convertToContainerModule()', () => {
          expect(convertToContainerModule).toHaveBeenCalledTimes(1);
          expect(convertToContainerModule).toHaveBeenCalledWith(
            containerModuleApiFixture,
          );
        });

        it('should call containerModule.load()', () => {
          expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
          expect(containerModuleMock.load).toHaveBeenCalledWith(
            containerBindingServiceFixture,
            metadataServiceFixture,
          );
        });
      });
    });
  });

  describe('having a ContainerModuleClassMetadataApi with imports', () => {
    let dependencyContainerModuleClassMetadataApiMock: jestMock.Mocked<ContainerModuleClassMetadataApi>;
    let containerModuleClassMetadataApiMock: jestMock.Mocked<ContainerModuleClassMetadataApi>;

    beforeAll(() => {
      dependencyContainerModuleClassMetadataApiMock =
        ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi;
      containerModuleClassMetadataApiMock = {
        ...ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi,
        imports: [dependencyContainerModuleClassMetadataApiMock],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleClassMetadataApiMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleClassMetadata = {
          imports: [
            {
              imports: expect.any(
                Array,
              ) as unknown as ContainerModuleMetadata[],
              loader: expect.any(
                Function,
              ) as unknown as ContainerModuleClassMetadata['loader'],
              moduleType: dependencyContainerModuleClassMetadataApiMock.module,
              type: ContainerModuleMetadataType.clazz,
            },
          ],
          loader: expect.any(
            Function,
          ) as unknown as ContainerModuleClassMetadata['loader'],
          moduleType: containerModuleClassMetadataApiMock.module,
          type: ContainerModuleMetadataType.clazz,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleClassMetadataApi with no imports', () => {
    let containerModuleClassMetadataApiMock: jestMock.Mocked<ContainerModuleClassMetadataApi>;

    beforeAll(() => {
      containerModuleClassMetadataApiMock =
        ContainerModuleMetadataApiMocks.anyContainerModuleClassMetadataApi;

      delete containerModuleClassMetadataApiMock.imports;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleClassMetadataApiMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleClassMetadata = {
          imports: [],
          loader: expect.any(
            Function,
          ) as unknown as ContainerModuleClassMetadata['loader'],
          moduleType: containerModuleClassMetadataApiMock.module,
          type: ContainerModuleMetadataType.clazz,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi', () => {
    let containerModuleFactoryMetadataApiMock: jestMock.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi;
    });

    describe('when called', () => {
      let result: unknown;
      let containerModuleMetadata: ContainerModuleFactoryMetadata;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleFactoryMetadataApiMock,
        );

        containerModuleMetadata = result as ContainerModuleFactoryMetadata;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          imports: expect.any(Array) as unknown as ContainerModuleMetadata[],
          injects: expect.any(Array) as unknown as ClassElementMetadata[],
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });

      describe('when factory is called and containerModuleMetadataApi.factory returns a promise', () => {
        let containerModuleApiFixture: ContainerModuleApi;
        let containerModuleFixture: ContainerModule;
        let argumentsFixture: unknown[];
        let result: unknown;

        beforeAll(async () => {
          containerModuleApiFixture = {
            _tag: 'containerModuleApi',
          } as unknown as ContainerModuleApi;

          containerModuleFixture = {
            _tag: 'containerModule',
          } as unknown as ContainerModule;

          (
            convertToContainerModuleAsync as jestMock.Mock<
              typeof convertToContainerModuleAsync
            >
          ).mockResolvedValueOnce(containerModuleFixture);

          (
            containerModuleFactoryMetadataApiMock.factory as jestMock.Mock<
              () => Promise<ContainerModuleApi>
            >
          ).mockResolvedValueOnce(containerModuleApiFixture);

          argumentsFixture = [Symbol()];

          result = await containerModuleMetadata.factory(...argumentsFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerModuleMetadataApi.factory()', () => {
          expect(
            containerModuleFactoryMetadataApiMock.factory,
          ).toHaveBeenCalledTimes(1);
          expect(
            containerModuleFactoryMetadataApiMock.factory,
          ).toHaveBeenCalledWith(...argumentsFixture);
        });

        it('should call convertToContainerModuleAsync()', () => {
          expect(convertToContainerModuleAsync).toHaveBeenCalledTimes(1);
          expect(convertToContainerModuleAsync).toHaveBeenCalledWith(
            Promise.resolve(containerModuleApiFixture),
          );
        });

        it('should return a ContainerModule', () => {
          expect(result).toBe(containerModuleFixture);
        });
      });

      describe('when factory is called and containerModuleMetadataApi.factory returns a non promise', () => {
        let containerModuleApiFixture: ContainerModuleApi;
        let containerModuleFixture: ContainerModule;
        let argumentsFixture: unknown[];
        let result: unknown;

        beforeAll(() => {
          containerModuleApiFixture = {
            _tag: 'containerModuleApi',
          } as unknown as ContainerModuleApi;

          containerModuleFixture = {
            _tag: 'containerModule',
          } as unknown as ContainerModule;

          (
            convertToContainerModule as jestMock.Mock<
              typeof convertToContainerModule
            >
          ).mockReturnValueOnce(containerModuleFixture);

          containerModuleFactoryMetadataApiMock.factory.mockReturnValueOnce(
            containerModuleApiFixture,
          );

          argumentsFixture = [Symbol()];

          result = containerModuleMetadata.factory(...argumentsFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerModuleMetadataApi.factory()', () => {
          expect(
            containerModuleFactoryMetadataApiMock.factory,
          ).toHaveBeenCalledTimes(1);
          expect(
            containerModuleFactoryMetadataApiMock.factory,
          ).toHaveBeenCalledWith(...argumentsFixture);
        });

        it('should call convertToContainerModule()', () => {
          expect(convertToContainerModule).toHaveBeenCalledTimes(1);
          expect(convertToContainerModule).toHaveBeenCalledWith(
            containerModuleApiFixture,
          );
        });

        it('should return a ContainerModule', () => {
          expect(result).toBe(containerModuleFixture);
        });
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with injects', () => {
    let containerModuleFactoryMetadataApiMock: jestMock.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.withInjects;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleFactoryMetadataApiMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expectedInjects: ClassElementMetadata[] = (
          containerModuleFactoryMetadataApiMock.injects as ServiceId[]
        ).map(
          (serviceId: ServiceId): ClassElementMetadata => ({
            type: ClassElementMetadataType.serviceId,
            value: serviceId,
          }),
        );

        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          imports: expect.any(Array) as unknown as ContainerModuleMetadata[],
          injects: expectedInjects,
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with no injects', () => {
    let containerModuleFactoryMetadataApiMock: jestMock.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      containerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.withNoInjects;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleFactoryMetadataApiMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          imports: expect.any(Array) as unknown as ContainerModuleMetadata[],
          injects: [],
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with imports', () => {
    let dependencyContainerModuleFactoryMetadataApiMock: jestMock.Mocked<ContainerModuleFactoryMetadataApi>;
    let containerModuleFactoryMetadataApiMock: jestMock.Mocked<ContainerModuleFactoryMetadataApi>;

    beforeAll(() => {
      dependencyContainerModuleFactoryMetadataApiMock =
        ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi;
      containerModuleFactoryMetadataApiMock = {
        ...ContainerModuleMetadataApiMocks.anyContainerModuleFactoryMetadataApi,
        imports: [dependencyContainerModuleFactoryMetadataApiMock],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToContainerModuleMetadata(
          containerModuleFactoryMetadataApiMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a ContainerModuleMetadata', () => {
        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as unknown as ContainerModuleFactoryMetadata['factory'],
          imports: [
            {
              factory: expect.any(
                Function,
              ) as unknown as ContainerModuleFactoryMetadata['factory'],
              imports: expect.any(
                Array,
              ) as unknown as ContainerModuleMetadata[],
              injects: expect.any(Array) as unknown as ClassElementMetadata[],
              type: ContainerModuleMetadataType.factory,
            },
          ],
          injects: expect.any(Array) as unknown as ClassElementMetadata[],
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
