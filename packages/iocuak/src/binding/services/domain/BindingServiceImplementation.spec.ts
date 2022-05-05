import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TypeBindingFixtures } from '../../fixtures/domain/TypeBindingFixtures';
import { Binding } from '../../models/domain/Binding';
import { BindingTag } from '../../models/domain/BindingTag';
import { BindingService } from './BindingService';
import { BindingServiceImplementation } from './BindingServiceImplementation';

describe(BindingServiceImplementation.name, () => {
  describe('.get', () => {
    describe('when called, and serviceIdToInstanceMap has no entries and parent is undefined', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        result = containerBindingServiceImplementation.get('service-id');
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and serviceIdToInstanceMap has no entries and parent has no entries', () => {
      let parent: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        parent = {
          get: jest.fn().mockReturnValueOnce(undefined),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parent);

        result = containerBindingServiceImplementation.get('service-id');
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and serviceIdToInstanceMap has no entries and parent has an entry with the same service id', () => {
      let parent: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        bindingFixture = TypeBindingFixtures.any;

        parent = {
          get: jest.fn().mockReturnValueOnce(bindingFixture),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parent);

        result = containerBindingServiceImplementation.get(bindingFixture.id);
      });

      it('should return the entry value', () => {
        expect(result).toBe(bindingFixture);
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry with the same service id', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        bindingFixture = TypeBindingFixtures.any;

        containerBindingServiceImplementation.set(bindingFixture);

        result = containerBindingServiceImplementation.get(bindingFixture.id);
      });

      it('should return the entry value', () => {
        expect(result).toBe(bindingFixture);
      });
    });
  });

  describe('.getByTag', () => {
    describe('having removeDuplicates false', () => {
      let removeDuplicatesFixture: boolean;

      beforeAll(() => {
        removeDuplicatesFixture = false;
      });

      describe('when called, and tagToBindingsMap has an entry with the same tag and parent has the same entry', () => {
        let parent: jest.Mocked<BindingService>;
        let containerBindingServiceImplementation: BindingServiceImplementation;
        let bindingFixture: Binding;

        let result: unknown;

        beforeAll(() => {
          bindingFixture = TypeBindingFixtures.withTagsOne;
          const [tag]: BindingTag[] = TypeBindingFixtures.withTagsOne.tags;

          parent = {
            getByTag: jest.fn().mockReturnValueOnce([bindingFixture]),
          } as Partial<
            jest.Mocked<BindingService>
          > as jest.Mocked<BindingService>;

          containerBindingServiceImplementation =
            new BindingServiceImplementation(parent);

          containerBindingServiceImplementation.set(bindingFixture);

          result = [
            ...containerBindingServiceImplementation.getByTag(
              tag,
              removeDuplicatesFixture,
            ),
          ];
        });

        it('should return the entry value duplicated', () => {
          expect(result).toStrictEqual([bindingFixture, bindingFixture]);
        });
      });
    });

    describe('having removeDuplicates true', () => {
      let removeDuplicatesFixture: boolean;

      beforeAll(() => {
        removeDuplicatesFixture = true;
      });

      describe('when called, and tagToBindingsMap has an entry with the same tag and parent has the same entry', () => {
        let parent: jest.Mocked<BindingService>;
        let containerBindingServiceImplementation: BindingServiceImplementation;
        let bindingFixture: Binding;

        let result: unknown;

        beforeAll(() => {
          bindingFixture = TypeBindingFixtures.withTagsOne;
          const [tag]: BindingTag[] = TypeBindingFixtures.withTagsOne.tags;

          parent = {
            getByTag: jest.fn().mockReturnValueOnce([bindingFixture]),
          } as Partial<
            jest.Mocked<BindingService>
          > as jest.Mocked<BindingService>;

          containerBindingServiceImplementation =
            new BindingServiceImplementation(parent);

          containerBindingServiceImplementation.set(bindingFixture);

          result = [
            ...containerBindingServiceImplementation.getByTag(
              tag,
              removeDuplicatesFixture,
            ),
          ];
        });

        it('should return the entry value', () => {
          expect(result).toStrictEqual([bindingFixture]);
        });
      });
    });

    describe('when called, and tagToBindingsMap has no entries and parent is undefined', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        result = [
          ...containerBindingServiceImplementation.getByTag('tag-id', false),
        ];
      });

      it('should return an empty iterable', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('when called, and tagToBindingsMap has no entries and parent has no entries', () => {
      let parent: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        parent = {
          getByTag: jest.fn().mockReturnValueOnce([]),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parent);

        result = [
          ...containerBindingServiceImplementation.getByTag('tag-id', false),
        ];
      });

      it('should return an empty iterable', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('when called, and tagToBindingsMap has no entries and parent has an entry with the same tag', () => {
      let parent: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        bindingFixture = TypeBindingFixtures.any;

        parent = {
          getByTag: jest.fn().mockReturnValueOnce([bindingFixture]),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parent);

        result = [
          ...containerBindingServiceImplementation.getByTag('tag-id', false),
        ];
      });

      it('should return the entry value', () => {
        expect(result).toStrictEqual([bindingFixture]);
      });
    });

    describe('when called, and tagToBindingsMap has an entry with the same tag and parent has no entries', () => {
      let parent: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        parent = {
          getByTag: jest.fn().mockReturnValueOnce([]),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parent);

        bindingFixture = TypeBindingFixtures.withTagsOne;
        const [tag]: BindingTag[] = TypeBindingFixtures.withTagsOne.tags;

        containerBindingServiceImplementation.set(bindingFixture);

        result = [
          ...containerBindingServiceImplementation.getByTag(tag, false),
        ];
      });

      it('should return the entry value', () => {
        expect(result).toStrictEqual([bindingFixture]);
      });
    });
  });

  describe('.getAll', () => {
    describe('when called, and serviceIdToInstanceMap has an entry and parent is undefined', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        bindingFixture = TypeBindingFixtures.any;

        containerBindingServiceImplementation.set(bindingFixture);

        result = containerBindingServiceImplementation.getAll();
      });

      it('should return a service to binding map', () => {
        expect(result).toStrictEqual(
          new Map<ServiceId, Binding>([[bindingFixture.id, bindingFixture]]),
        );
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry and parent has an entry with different id', () => {
      let parentMock: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let parentBindingFixture: Binding;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        parentBindingFixture = {
          ...TypeBindingFixtures.any,
          id: 'parent-service-id',
        };

        parentMock = {
          getAll: jest
            .fn()
            .mockReturnValueOnce(
              new Map<ServiceId, Binding>([
                [parentBindingFixture.id, parentBindingFixture],
              ]),
            ),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parentMock);

        bindingFixture = {
          ...TypeBindingFixtures.any,
          id: 'service-id',
        };

        containerBindingServiceImplementation.set(bindingFixture);

        result = containerBindingServiceImplementation.getAll();
      });

      it('should return a service to binding map', () => {
        expect(result).toStrictEqual(
          new Map<ServiceId, Binding>([
            [bindingFixture.id, bindingFixture],
            [parentBindingFixture.id, parentBindingFixture],
          ]),
        );
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry and parent has an entry with same id', () => {
      let parentMock: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let parentBindingFixture: Binding;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        parentBindingFixture = {
          ...TypeBindingFixtures.withScopeSingleton,
          id: 'service-id',
        };

        parentMock = {
          getAll: jest
            .fn()
            .mockReturnValueOnce(
              new Map<ServiceId, Binding>([
                [parentBindingFixture.id, parentBindingFixture],
              ]),
            ),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parentMock);

        bindingFixture = {
          ...TypeBindingFixtures.withScopeTransient,
          id: 'service-id',
        };

        containerBindingServiceImplementation.set(bindingFixture);

        result = containerBindingServiceImplementation.getAll();
      });

      it('should return a service to binding map', () => {
        expect(result).toStrictEqual(
          new Map<ServiceId, Binding>([[bindingFixture.id, bindingFixture]]),
        );
      });
    });
  });

  describe('.set', () => {
    describe('having a bindingFixture with a tag', () => {
      let bindingFixture: Binding;
      let tag: BindingTag;

      beforeAll(() => {
        bindingFixture = TypeBindingFixtures.withTagsOne;
        // eslint-disable-next-line @typescript-eslint/typedef
        [tag] = TypeBindingFixtures.withTagsOne.tags;
      });

      describe('when called', () => {
        let containerBindingServiceImplementation: BindingServiceImplementation;

        beforeAll(() => {
          containerBindingServiceImplementation =
            new BindingServiceImplementation();

          containerBindingServiceImplementation.set(bindingFixture);
        });

        describe('when .getByTag() is called with the same tag', () => {
          let result: unknown;

          beforeAll(() => {
            result = [
              ...containerBindingServiceImplementation.getByTag(tag, true),
            ];
          });

          it('should return an instance', () => {
            expect(result).toStrictEqual([bindingFixture]);
          });
        });
      });
    });

    describe('when called', () => {
      let bindingFixture: Binding;
      let containerBindingServiceImplementation: BindingServiceImplementation;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        bindingFixture = TypeBindingFixtures.any;

        containerBindingServiceImplementation.set(bindingFixture);
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerBindingServiceImplementation.get(bindingFixture.id);
        });

        it('should return an instance', () => {
          expect(result).toBe(bindingFixture);
        });
      });
    });
  });

  describe('.remove', () => {
    describe('when called, and serviceIdToInstanceMap has no entries', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let serviceIdFixture: ServiceId;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        serviceIdFixture = 'sample-service-id';

        containerBindingServiceImplementation.remove(serviceIdFixture);
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerBindingServiceImplementation.get(serviceIdFixture);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry with the same service id', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        bindingFixture = TypeBindingFixtures.any;

        containerBindingServiceImplementation.set(bindingFixture);

        containerBindingServiceImplementation.remove(bindingFixture.id);
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerBindingServiceImplementation.get(bindingFixture.id);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
