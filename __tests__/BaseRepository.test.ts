import { BaseRepository } from '../src/BaseRepository';
import { BaseRestResource } from '../src/BaseRestResource';
import { createMock } from '../domain-testing/helpers';

// global
declare var global: any;
class FakeFormData {
  public append = jest.fn();
}

(global as any).FormData = FakeFormData;

const successResourceResponse = {
  _status: '200',
  data: 'any',
};

const successRepositoryResponse = {
  data: 'any',
  meta: {
    responseStatus: '200',
  },
};

type SetupOptions = {
  jestResourceCreateMock?: jest.Mock<any, any>;
  jestResourceUpdateMock?: jest.Mock<any, any>;
  jestResourcePatchMock?: jest.Mock<any, any>;
  jestResourceDeleteMock?: jest.Mock<any, any>;
  jestResourceGetMock?: jest.Mock<any, any>;
  jestChildResourceCreateMock?: jest.Mock<any, any>;
  jestChildResourceUpdateMock?: jest.Mock<any, any>;
  jestChildResourcePatchMock?: jest.Mock<any, any>;
  jestChildResourceDeleteMock?: jest.Mock<any, any>;
  jestChildResourceGetMock?: jest.Mock<any, any>;
};

const setup = (setupOptions: SetupOptions = {}) => {
  const {
    jestResourceCreateMock = jest.fn().mockResolvedValue(successResourceResponse),
    jestResourceUpdateMock = jest.fn().mockResolvedValue(successResourceResponse),
    jestResourcePatchMock = jest.fn().mockResolvedValue(successResourceResponse),
    jestResourceDeleteMock = jest.fn().mockResolvedValue(undefined),
    jestResourceGetMock = jest.fn().mockResolvedValue(successResourceResponse),

    jestChildResourceCreateMock = jest.fn().mockResolvedValue(successResourceResponse),
    jestChildResourceUpdateMock = jest.fn().mockResolvedValue(successResourceResponse),
    jestChildResourcePatchMock = jest.fn().mockResolvedValue(successResourceResponse),
    jestChildResourceDeleteMock = jest.fn().mockResolvedValue(undefined),
    jestChildResourceGetMock = jest.fn().mockResolvedValue(successResourceResponse),
  } = setupOptions;

  const fakeChildRestResource = createMock<BaseRestResource>({
    create: jestChildResourceCreateMock,
    update: jestChildResourceUpdateMock,
    patch: jestChildResourcePatchMock,
    get: jestChildResourceGetMock,
    delete: jestChildResourceDeleteMock,
    child() {
      return this;
    },
    getRequestResource() {
      return null;
    },
  });
  const fakeRestResource = createMock<BaseRestResource>({
    create: jestResourceCreateMock,
    update: jestResourceUpdateMock,
    patch: jestResourcePatchMock,
    get: jestResourceGetMock,
    delete: jestResourceDeleteMock,
    child() {
      return fakeChildRestResource;
    },
    getRequestResource() {
      return null;
    },
  });
  const testRepository = new BaseRepository(fakeRestResource);
  return { fakeChildRestResource, fakeRestResource, testRepository };
};

describe('BaseRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('BaseRepository instance', () => {
    const { testRepository } = setup();
    it('testRepository instance of BaseRepository', async () => {
      expect(testRepository).toBeInstanceOf(BaseRepository);
    });
  });

  describe('Create method', () => {
    const { fakeRestResource, testRepository } = setup();

    it('method should be defined', () => {
      expect(testRepository.create).toBeInstanceOf(Function);
    });
    it('should called with expected params', async () => {
      const expectedBody = expect.objectContaining({ data: 1 });
      const response = await testRepository.create({ data: 1 });
      expect(fakeRestResource.create).toHaveBeenCalledWith(expectedBody);
      expect(response).toBeDefined();
      expect(response).toEqual(successRepositoryResponse);
    });
  });

  describe('Update method', () => {
    const { fakeChildRestResource, testRepository } = setup();

    it('method should be defined', () => {
      const { testRepository } = setup();
      expect(testRepository.update).toBeInstanceOf(Function);
    });
    it('should called with expected params', async () => {
      const expectedBody = expect.objectContaining({ id: 2, data: 1 });
      const response = await testRepository.update({ id: 2, data: 1 });
      expect(fakeChildRestResource.update).toHaveBeenCalledWith(expectedBody);
      expect(response).toBeDefined();
      expect(response).toEqual(successRepositoryResponse);
    });
  });

  describe('Patch method', () => {
    const { fakeChildRestResource, testRepository } = setup();

    it('method should be defined', () => {
      expect(testRepository.patch).toBeInstanceOf(Function);
    });
    it('should called with expected params', async () => {
      const expectedBody = expect.objectContaining({ id: 2, data: 1 });
      const response = await testRepository.patch({ id: 2, data: 1 });
      expect(fakeChildRestResource.patch).toHaveBeenCalledWith(expectedBody);
      expect(response).toBeDefined();
      expect(response).toEqual(successRepositoryResponse);
    });
  });

  describe('Load method', () => {
    const { fakeRestResource, testRepository } = setup();

    it('method should be defined', () => {
      expect(testRepository.load).toBeInstanceOf(Function);
    });

    it('should called with expected params', async () => {
      const expectedBody = expect.objectContaining({ id: 2, data: 1 });
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(fakeRestResource.get).toHaveBeenCalledWith(expectedBody);
      expect(response).toBeDefined();
      expect(response).toEqual(successRepositoryResponse);
    });
  });

  describe('LoadById method', () => {
    const { fakeChildRestResource, testRepository } = setup();
    it('method should be defined', () => {
      expect(testRepository.loadById).toBeInstanceOf(Function);
    });
    it('should called with expected params', async () => {
      const response = await testRepository.loadById(2);
      expect(fakeChildRestResource.get).toHaveBeenCalledWith(undefined);
      expect(response).toBeDefined();
      expect(response).toEqual(successRepositoryResponse);
    });
  });

  describe('Delete method', () => {
    const { fakeChildRestResource, testRepository } = setup();
    it('method should be defined', () => {
      expect(testRepository.delete).toBeInstanceOf(Function);
    });
    it('should called with expected params', async () => {
      const response = await testRepository.delete({ id: 2, data: 1 });
      expect(fakeChildRestResource.delete).toHaveBeenCalledWith();
      expect(response).toBeUndefined();
    });
  });

  describe('Search method', () => {
    const { fakeRestResource, testRepository } = setup();
    it('method should be defined', () => {
      expect(testRepository.search).toBeInstanceOf(Function);
    });
    it('should called with expected params', async () => {
      const expectedBody = expect.objectContaining({
        search: { id: 2, data: 1 },
        page: 1,
        per_page: 10,
        order: 'asc',
      });
      const response = await testRepository.search({
        id: 2,
        data: 1,
        page: 1,
        per_page: 10,
        sort: 'asc',
      });
      expect(fakeRestResource.get).toHaveBeenCalledWith(expectedBody);
      expect(response).toBeDefined();
      expect(response).toEqual(successRepositoryResponse);
    });
    it('should called with expected params in another settings', async () => {
      testRepository.setSettings({
        pageKey: 'p',
        perPageKey: 'pp',
        sortKey: 'sort',
        searchKey: 'filter',
      });
      const expectedBody = expect.objectContaining({
        filter: { id: 2, data: 1 },
        p: 1,
        pp: 10,
        sort: 'asc',
      });
      const response = await testRepository.search({
        id: 2,
        data: 1,
        page: 1,
        per_page: 10,
        sort: 'asc',
      });
      expect(fakeRestResource.get).toHaveBeenCalledWith(expectedBody);
      expect(response).toBeDefined();
      expect(response).toEqual(successRepositoryResponse);
    });
  });

  describe('isEntityNew method', () => {
    const { fakeRestResource, testRepository } = setup();

    it('method should be defined', () => {
      expect(testRepository.isEntityNew).toBeInstanceOf(Function);
    });
    it('should detect is entity new by identificator', async () => {
      const isNew1 = testRepository.isEntityNew({ data: 1 });
      const isNew2 = testRepository.isEntityNew({ id: 2, data: 1 });
      expect(isNew1).toBeTruthy();
      expect(isNew2).toBeFalsy();

      class TestRepositoryWithUUIDEntityKey extends BaseRepository {
        entityIdName = 'uuid';
      }

      const testRepository2 = new TestRepositoryWithUUIDEntityKey(fakeRestResource);
      const isNew3 = testRepository2.isEntityNew({ data: 1 });
      const isNew4 = testRepository2.isEntityNew({ id: 2, data: 1 });
      const isNew5 = testRepository2.isEntityNew({ uuid: 2, data: 1 });
      expect(isNew3).toBeTruthy();
      expect(isNew4).toBeTruthy();
      expect(isNew5).toBeFalsy();
    });
  });

  describe('setDefaultQueryParams method', () => {
    const { fakeRestResource, testRepository } = setup();
    it('method should be defined', () => {
      expect(testRepository.setDefaultQueryParams).toBeInstanceOf(Function);
    });
    it('should set default query params', async () => {
      testRepository.setDefaultQueryParams({ always: 'send with get' });
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(fakeRestResource.get).toHaveBeenCalledWith({
        id: 2,
        data: 1,
        params: { always: 'send with get' },
      });
      expect(response).toEqual(successRepositoryResponse);
    });
  });

  describe('getResource method', () => {
    const { fakeRestResource, testRepository } = setup();
    it('method should be defined', () => {
      expect(testRepository.getResource).toBeInstanceOf(Function);
    });
    it('should set default query params', async () => {
      const result = testRepository.getResource();
      expect(result).toBe(fakeRestResource);
    });
  });

  describe('Process response', () => {
    const { fakeRestResource, testRepository } = setup({
      jestResourceGetMock: jest
        .fn()
        .mockResolvedValueOnce({ ...successResourceResponse, data: [1, 2, 3] })
        .mockResolvedValueOnce('hello world')
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(Object.assign([1, 2, 3, 4], { _status: 200 }))
        .mockResolvedValueOnce({ _status: 200, id: 1, name: 'Johny', birthday: '12.12.1234' })
        .mockResolvedValue(successResourceResponse),
    });
    it('should process array in data field', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toEqual(expect.any(Array));
    });
    it('should process string in data field', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toEqual(expect.any(String));
    });
    it('should process false', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toEqual(expect.any(Number));
    });
    it('should process true', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toBe(true);
    });
    it('should process false', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toBe(false);
    });
    it('should process null', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toEqual(null);
    });
    it('should process undefined', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toEqual(undefined);
    });
    it('should process undefined', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toEqual(expect.arrayContaining([1, 2, 3, 4]));
    });
    it('should process entity in data', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toEqual(
        expect.objectContaining({
          meta: expect.objectContaining({
            responseStatus: expect.anything(),
          }),
          id: expect.anything(),
          name: expect.anything(),
          birthday: expect.anything(),
        })
      );
    });
    it('should remove contain only meta and data', async () => {
      const response = await testRepository.load({ id: 2, data: 1 });
      expect(response).toEqual(
        expect.objectContaining({
          meta: expect.objectContaining({
            responseStatus: expect.anything(),
          }),
          data: expect.any(String),
        })
      );
    });
  });

  // 2) catch errors
});
