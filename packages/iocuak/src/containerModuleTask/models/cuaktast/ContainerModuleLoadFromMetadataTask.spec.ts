import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleLoadFromMetadataTaskKindMocks } from '../../mocks/models/domain/ContainerModuleLoadFromMetadataTaskKindMocks';
import { ContainerModuleFactoryMetadata } from '../domain/ContainerModuleFactoryMetadata';
import { ContainerModuleLoadFromMetadataTaskKind } from '../domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleLoadFromMetadataTask } from './ContainerModuleLoadFromMetadataTask';

describe(ContainerModuleLoadFromMetadataTask.name, () => {
  describe('.perform()', () => {
    describe('having a ContainerModuleLoadFromMetadataTaskKind with ContainerModuleFactoryMetadata', () => {
      let taskKindMock: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata>;

      let containerBindingServiceFixture: ContainerBindingService;
      let metadataServiceFixture: MetadataService;

      let containerModuleMock: jest.Mocked<ContainerModule>;

      beforeAll(() => {
        taskKindMock =
          ContainerModuleLoadFromMetadataTaskKindMocks.withMetadataContainerModuleFactoryMetadata;

        containerBindingServiceFixture = {
          _tag: Symbol('containerBindingService'),
        } as unknown as ContainerBindingService;
        metadataServiceFixture = {
          _tag: Symbol('MetadataService'),
        } as unknown as MetadataService;

        containerModuleMock = {
          load: jest.fn(),
        };
      });

      describe('having undefined as task input', () => {
        describe('when called, and taskKind metadata factory returns a syncronous result', () => {
          let containerModuleLoadFromMetadataTask: ContainerModuleLoadFromMetadataTask;

          let result: unknown;

          beforeAll(() => {
            (
              taskKindMock.metadata.factory as jest.Mock<ContainerModule>
            ).mockReturnValueOnce(containerModuleMock);

            containerModuleLoadFromMetadataTask =
              new ContainerModuleLoadFromMetadataTask(
                taskKindMock,
                [],
                containerBindingServiceFixture,
                metadataServiceFixture,
              );

            result = containerModuleLoadFromMetadataTask.perform();
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call taskKind.metadata.factory', () => {
            expect(taskKindMock.metadata.factory).toHaveBeenCalledTimes(1);
            expect(taskKindMock.metadata.factory).toHaveBeenCalledWith();
          });

          it('should call containerModule.load()', () => {
            expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
            expect(containerModuleMock.load).toHaveBeenCalledWith(
              containerBindingServiceFixture,
              metadataServiceFixture,
            );
          });

          it('should return a ContainerModule', () => {
            expect(result).toBe(containerModuleMock);
          });
        });

        describe('when called, and taskKind metadata factory returns an asyncronous result', () => {
          let containerModuleLoadFromMetadataTask: ContainerModuleLoadFromMetadataTask;

          let result: unknown;

          beforeAll(async () => {
            (
              taskKindMock.metadata.factory as jest.Mock<
                Promise<ContainerModule>
              >
            ).mockResolvedValueOnce(containerModuleMock);

            containerModuleLoadFromMetadataTask =
              new ContainerModuleLoadFromMetadataTask(
                taskKindMock,
                [],
                containerBindingServiceFixture,
                metadataServiceFixture,
              );

            result = await containerModuleLoadFromMetadataTask.perform();
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call taskKind.metadata.factory', () => {
            expect(taskKindMock.metadata.factory).toHaveBeenCalledTimes(1);
            expect(taskKindMock.metadata.factory).toHaveBeenCalledWith();
          });

          it('should call containerModule.load()', () => {
            expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
            expect(containerModuleMock.load).toHaveBeenCalledWith(
              containerBindingServiceFixture,
              metadataServiceFixture,
            );
          });

          it('should return a ContainerModule', () => {
            expect(result).toBe(containerModuleMock);
          });
        });
      });

      describe('having an array of service ids as task input', () => {
        let instanceFixture: unknown;

        beforeAll(() => {
          instanceFixture = Symbol();
        });

        describe('when called, and taskKind metadata factory returns a syncronous result', () => {
          let containerModuleLoadFromMetadataTask: ContainerModuleLoadFromMetadataTask;

          let result: unknown;

          beforeAll(() => {
            (
              taskKindMock.metadata.factory as jest.Mock<ContainerModule>
            ).mockReturnValueOnce(containerModuleMock);

            containerModuleLoadFromMetadataTask =
              new ContainerModuleLoadFromMetadataTask(
                taskKindMock,
                [],
                containerBindingServiceFixture,
                metadataServiceFixture,
              );

            result = containerModuleLoadFromMetadataTask.perform([
              instanceFixture,
            ]);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call taskKind.metadata.factory', () => {
            expect(taskKindMock.metadata.factory).toHaveBeenCalledTimes(1);
            expect(taskKindMock.metadata.factory).toHaveBeenCalledWith(
              instanceFixture,
            );
          });

          it('should call containerModule.load()', () => {
            expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
            expect(containerModuleMock.load).toHaveBeenCalledWith(
              containerBindingServiceFixture,
              metadataServiceFixture,
            );
          });

          it('should return a ContainerModule', () => {
            expect(result).toBe(containerModuleMock);
          });
        });

        describe('when called, and taskKind metadata factory returns an asyncronous result', () => {
          let containerModuleLoadFromMetadataTask: ContainerModuleLoadFromMetadataTask;

          let result: unknown;

          beforeAll(async () => {
            (
              taskKindMock.metadata.factory as jest.Mock<
                Promise<ContainerModule>
              >
            ).mockResolvedValueOnce(containerModuleMock);

            containerModuleLoadFromMetadataTask =
              new ContainerModuleLoadFromMetadataTask(
                taskKindMock,
                [],
                containerBindingServiceFixture,
                metadataServiceFixture,
              );

            result = await containerModuleLoadFromMetadataTask.perform([
              instanceFixture,
            ]);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call taskKind.metadata.factory', () => {
            expect(taskKindMock.metadata.factory).toHaveBeenCalledTimes(1);
            expect(taskKindMock.metadata.factory).toHaveBeenCalledWith(
              instanceFixture,
            );
          });

          it('should call containerModule.load()', () => {
            expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
            expect(containerModuleMock.load).toHaveBeenCalledWith(
              containerBindingServiceFixture,
              metadataServiceFixture,
            );
          });

          it('should return a ContainerModule', () => {
            expect(result).toBe(containerModuleMock);
          });
        });
      });
    });
  });
});
