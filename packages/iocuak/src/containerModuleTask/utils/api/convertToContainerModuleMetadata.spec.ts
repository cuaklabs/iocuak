jest.mock('./convertToContainerModule');
jest.mock('./convertToContainerModuleAsync');

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';
import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleMetadataApiMocks } from '../../mocks/models/api/ContainerModuleMetadataApiMocks';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleClassMetadata } from '../../models/domain/ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from '../../models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from '../../models/domain/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../../models/domain/ContainerModuleMetadataType';
import { convertToContainerModule } from './convertToContainerModule';
import { convertToContainerModuleAsync } from './convertToContainerModuleAsync';
import { convertToContainerModuleMetadata } from './convertToContainerModuleMetadata';

describe(convertToContainerModuleMetadata.name, () => {
  describe('having a ContainerModuleClassMetadataApi', () => {
    let containerModuleClassMetadataApiMock: jest.Mocked<ContainerModuleClassMetadataApi>;

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
          imports: expect.any(Array) as ContainerModuleMetadata[],
          loader: expect.any(
            Function,
          ) as ContainerModuleClassMetadata['loader'],
          moduleType: containerModuleClassMetadataApiMock.module,
          type: ContainerModuleMetadataType.clazz,
        };

        expect(result).toStrictEqual(expected);
      });

      describe('when loader is called', () => {
        let containerModuleMock: jest.Mocked<ContainerModule>;
        let containerModuleApiFixture: ContainerModuleApi;
        let containerBindingServiceFixture: ContainerBindingService;
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
          } as Partial<ContainerBindingService> as ContainerBindingService;

          metadataServiceFixture = {
            _tag: Symbol('MetadataService'),
          } as Partial<MetadataService> as MetadataService;

          (
            convertToContainerModule as jest.Mock<ContainerModule>
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
    let dependencyContainerModuleClassMetadataApiMock: jest.Mocked<ContainerModuleClassMetadataApi>;
    let containerModuleClassMetadataApiMock: jest.Mocked<ContainerModuleClassMetadataApi>;

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
              imports: expect.any(Array) as ContainerModuleMetadata[],
              loader: expect.any(
                Function,
              ) as ContainerModuleClassMetadata['loader'],
              moduleType: dependencyContainerModuleClassMetadataApiMock.module,
              type: ContainerModuleMetadataType.clazz,
            },
          ],
          loader: expect.any(
            Function,
          ) as ContainerModuleClassMetadata['loader'],
          moduleType: containerModuleClassMetadataApiMock.module,
          type: ContainerModuleMetadataType.clazz,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi', () => {
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

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
          ) as ContainerModuleFactoryMetadata['factory'],
          imports: expect.any(Array) as ContainerModuleMetadata[],
          injects: expect.any(Array) as ServiceId[],
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
            convertToContainerModuleAsync as jest.Mock<Promise<ContainerModule>>
          ).mockResolvedValueOnce(containerModuleFixture);

          containerModuleFactoryMetadataApiMock.factory.mockResolvedValueOnce(
            containerModuleApiFixture,
          );

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
            convertToContainerModule as jest.Mock<ContainerModule>
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
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

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
        const expected: ContainerModuleMetadata = {
          factory: expect.any(
            Function,
          ) as ContainerModuleFactoryMetadata['factory'],
          imports: expect.any(Array) as ContainerModuleMetadata[],
          injects: containerModuleFactoryMetadataApiMock.injects as ServiceId[],
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with no injects', () => {
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

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
          ) as ContainerModuleFactoryMetadata['factory'],
          imports: expect.any(Array) as ContainerModuleMetadata[],
          injects: [],
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadataApi with imports', () => {
    let dependencyContainerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;
    let containerModuleFactoryMetadataApiMock: jest.Mocked<ContainerModuleFactoryMetadataApi>;

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
          ) as ContainerModuleFactoryMetadata['factory'],
          imports: [
            {
              factory: expect.any(
                Function,
              ) as ContainerModuleFactoryMetadata['factory'],
              imports: expect.any(Array) as ContainerModuleMetadata[],
              injects: expect.any(Array) as ServiceId[],
              type: ContainerModuleMetadataType.factory,
            },
          ],
          injects: expect.any(Array) as ServiceId[],
          type: ContainerModuleMetadataType.factory,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
