jest.mock('./CreationContainerModuleApi');
jest.mock('./DeleteContainerModuleApi');
jest.mock('./ReadContainerModuleApi');
jest.mock('./UpdateContainerModuleApi');

import { ContainerApi } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { CreationContainerModuleApi } from './CreationContainerModuleApi';
import { CrudContainerModuleApi } from './CrudContainerModuleApi';
import { DeleteContainerModuleApi } from './DeleteContainerModuleApi';
import { ReadContainerModuleApi } from './ReadContainerModuleApi';
import { UpdateContainerModuleApi } from './UpdateContainerModuleApi';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(CrudContainerModuleApi.name, () => {
  let creationContainerModuleApiMock: jest.Mocked<
    CreationContainerModuleApi<ModelTest, QueryTest>
  >;
  let deleteContainerModuleApiMock: jest.Mocked<
    DeleteContainerModuleApi<QueryTest>
  >;
  let readContainerModuleApiMock: jest.Mocked<
    ReadContainerModuleApi<ModelTest, QueryTest>
  >;
  let updateContainerModuleApiMock: jest.Mocked<
    UpdateContainerModuleApi<QueryTest>
  >;

  beforeAll(() => {
    creationContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<CreationContainerModuleApi<ModelTest, QueryTest>>
    > as jest.Mocked<CreationContainerModuleApi<ModelTest, QueryTest>>;
    deleteContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<DeleteContainerModuleApi<QueryTest>>
    > as jest.Mocked<DeleteContainerModuleApi<QueryTest>>;
    readContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<ReadContainerModuleApi<ModelTest, QueryTest>>
    > as jest.Mocked<ReadContainerModuleApi<ModelTest, QueryTest>>;
    updateContainerModuleApiMock = {
      load: jest.fn(),
    } as Partial<
      jest.Mocked<UpdateContainerModuleApi<QueryTest>>
    > as jest.Mocked<UpdateContainerModuleApi<QueryTest>>;

    (CreationContainerModuleApi as jest.Mock).mockReturnValue(
      creationContainerModuleApiMock,
    );
    (DeleteContainerModuleApi as jest.Mock).mockReturnValue(
      deleteContainerModuleApiMock,
    );
    (ReadContainerModuleApi as jest.Mock).mockReturnValue(
      readContainerModuleApiMock,
    );
    (UpdateContainerModuleApi as jest.Mock).mockReturnValue(
      updateContainerModuleApiMock,
    );
  });

  describe('when instantiated', () => {
    let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
    let crudContainerModuleApi: CrudContainerModuleApi<ModelTest, QueryTest>;

    beforeAll(() => {
      crudModuleTypeToSymbolMap = Object.freeze({
        [CrudModuleType.createEntityAdapter]: Symbol(),
        [CrudModuleType.createEntityInteractor]: Symbol(),
        [CrudModuleType.deleteEntityAdapter]: Symbol(),
        [CrudModuleType.deleteEntityInteractor]: Symbol(),
        [CrudModuleType.readEntityAdapter]: Symbol(),
        [CrudModuleType.readManyEntityInteractor]: Symbol(),
        [CrudModuleType.readOneEntityInteractor]: Symbol(),
        [CrudModuleType.updateEntityAdapter]: Symbol(),
        [CrudModuleType.updateEntityInteractor]: Symbol(),
      });

      crudContainerModuleApi = new CrudContainerModuleApi(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call CreationContainerModuleApi()', () => {
      expect(CreationContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(CreationContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call DeleteContainerModuleApi()', () => {
      expect(DeleteContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(DeleteContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call ReadContainerModuleApi()', () => {
      expect(ReadContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(ReadContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    it('should call UpdateContainerModuleApi()', () => {
      expect(UpdateContainerModuleApi).toHaveBeenCalledTimes(1);
      expect(UpdateContainerModuleApi).toHaveBeenCalledWith(
        crudModuleTypeToSymbolMap,
      );
    });

    describe('.load()', () => {
      describe('when called', () => {
        let containerApiMock: jest.Mocked<ContainerApi>;

        beforeAll(() => {
          containerApiMock = {
            bind: jest.fn(),
          } as Partial<jest.Mocked<ContainerApi>> as jest.Mocked<ContainerApi>;

          crudContainerModuleApi.load(containerApiMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call creationContainerModuleApi.load()', () => {
          expect(creationContainerModuleApiMock.load).toHaveBeenCalledTimes(1);
          expect(creationContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call deleteContainerModuleApi.load()', () => {
          expect(deleteContainerModuleApiMock.load).toHaveBeenCalledTimes(1);
          expect(deleteContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call readContainerModuleApi.load()', () => {
          expect(readContainerModuleApiMock.load).toHaveBeenCalledTimes(1);
          expect(readContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });

        it('should call updateContainerModuleApi.load()', () => {
          expect(updateContainerModuleApiMock.load).toHaveBeenCalledTimes(1);
          expect(updateContainerModuleApiMock.load).toHaveBeenCalledWith(
            containerApiMock,
          );
        });
      });
    });
  });
});
