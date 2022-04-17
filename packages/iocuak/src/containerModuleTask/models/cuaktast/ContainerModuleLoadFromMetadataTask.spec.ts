import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleLoadFromMetadataTaskKindMocks } from '../../mocks/models/domain/ContainerModuleLoadFromMetadataTaskKindMocks';
import { ContainerModuleLoadFromMetadataTaskKind } from '../domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleLoadFromMetadataTask } from './ContainerModuleLoadFromMetadataTask';

describe(ContainerModuleLoadFromMetadataTask.name, () => {
  describe('.perform()', () => {
    let taskKindMock: ContainerModuleLoadFromMetadataTaskKind;

    let containerBindingServiceFixture: ContainerBindingService;
    let metadataServiceFixture: MetadataService;

    let containerModuleMock: jest.Mocked<ContainerModule>;
    let instanceFixture: unknown;

    beforeAll(() => {
      taskKindMock = ContainerModuleLoadFromMetadataTaskKindMocks.any;

      containerBindingServiceFixture = {
        _tag: Symbol('containerBindingService'),
      } as unknown as ContainerBindingService;
      metadataServiceFixture = {
        _tag: Symbol('MetadataService'),
      } as unknown as MetadataService;

      containerModuleMock = {
        load: jest.fn(),
      };

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

        result = containerModuleLoadFromMetadataTask.perform([instanceFixture]);
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
          taskKindMock.metadata.factory as jest.Mock<Promise<ContainerModule>>
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
