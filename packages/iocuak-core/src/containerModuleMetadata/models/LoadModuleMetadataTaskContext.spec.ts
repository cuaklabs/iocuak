import { beforeAll, describe, expect, it } from '@jest/globals';

import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModule } from '../../containerModule/models/ContainerModule';
import { CreateInstanceTaskContext } from '../../createInstanceTask/models/CreateInstanceTaskContext';
import { ContainerModuleMetadataMocks } from '../mocks/models/ContainerModuleMetadataMocks';
import { ContainerModuleFactoryMetadata } from './ContainerModuleFactoryMetadata';
import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { LoadModuleMetadataTaskContext } from './LoadModuleMetadataTaskContext';

function buildMetadataArrayWithCircularDependencies(): ContainerModuleMetadata[] {
  const containerModuleMetadataArray: ContainerModuleMetadata[] = [
    {
      ...ContainerModuleMetadataMocks.withIdAndRequiresEmptyArray,
      requires: [ContainerModuleMetadataMocks.withIdAndRequiresEmptyArray.id],
    },
  ];

  return containerModuleMetadataArray;
}

function buildMetadataArrayWithReferencedDependencies(): [
  ContainerModuleFactoryMetadata,
  ContainerModuleFactoryMetadata,
] {
  const containerModuleMetadataArray: [
    ContainerModuleFactoryMetadata,
    ContainerModuleFactoryMetadata,
  ] = [
    ContainerModuleMetadataMocks.withIdAndRequiresEmptyArray,
    {
      ...ContainerModuleMetadataMocks.any,
      id: Symbol.for('some-metadata-id'),
      requires: [ContainerModuleMetadataMocks.withIdAndRequiresEmptyArray.id],
    },
  ];

  return containerModuleMetadataArray;
}

function buildMetadataArrayWithUnreferencedDependencies(): ContainerModuleMetadata[] {
  const containerModuleMetadataArray: ContainerModuleMetadata[] = [
    ContainerModuleMetadataMocks.withRequiresEmptyArray,
    {
      ...ContainerModuleMetadataMocks.any,
      requires: ['unreferenced-id'],
    },
  ];

  return containerModuleMetadataArray;
}

function buildMetadataArrayWithChainAndUnreferencedDependency(): ContainerModuleMetadata[] {
  const firstId: ContainerModuleMetadataId = 'first-id';
  const secondId: ContainerModuleMetadataId = 'second-id';
  const thirdId: ContainerModuleMetadataId = 'third-id';
  const fourthId: ContainerModuleMetadataId = 'fourth-id';
  const unreferencedId: ContainerModuleMetadataId = 'unreferenced-id';

  const containerModuleMetadataArray: ContainerModuleMetadata[] = [
    {
      ...ContainerModuleMetadataMocks.any,
      id: firstId,
    },
    {
      ...ContainerModuleMetadataMocks.any,
      id: secondId,
      requires: [firstId],
    },
    {
      ...ContainerModuleMetadataMocks.any,
      id: thirdId,
      requires: [secondId],
    },
    {
      ...ContainerModuleMetadataMocks.any,
      id: fourthId,
      requires: [unreferencedId],
    },
  ];

  return containerModuleMetadataArray;
}

describe(LoadModuleMetadataTaskContext.name, () => {
  describe('.isMetadataArrayLoadable', () => {
    describe.each<[string, () => ContainerModuleMetadata[], boolean]>([
      ['with no elements', (): ContainerModuleMetadata[] => [], true],
      [
        'with metadata with no dependencies',
        (): ContainerModuleMetadata[] => [
          ContainerModuleMetadataMocks.withRequiresEmptyArray,
        ],
        true,
      ],
      [
        'with metadata with referenced dependencies',
        buildMetadataArrayWithReferencedDependencies,
        true,
      ],
      [
        'with metadata with unreferenced dependencies',
        buildMetadataArrayWithUnreferencedDependencies,
        false,
      ],
      [
        'with metadata with circular dependencies',
        buildMetadataArrayWithCircularDependencies,
        false,
      ],
      [
        'with metadata with chain and unreferenced dependency',
        buildMetadataArrayWithChainAndUnreferencedDependency,
        false,
      ],
    ])(
      'having a LoadModuleMetadataTaskContext with ContainerModuleMetadata[] %s',
      (
        _: string,
        containerModuleMetadataArrayFixtureBuilder: () => ContainerModuleMetadata[],
        expectedResult: boolean,
      ) => {
        let loadModuleMetadataTaskContextFixture: LoadModuleMetadataTaskContext;

        beforeAll(() => {
          const containerModuleMetadataArrayFixture: ContainerModuleMetadata[] =
            containerModuleMetadataArrayFixtureBuilder();

          const createInstanceTaskContextFixture: CreateInstanceTaskContext =
            Symbol() as unknown as CreateInstanceTaskContext;

          loadModuleMetadataTaskContextFixture =
            new LoadModuleMetadataTaskContext(
              createInstanceTaskContextFixture,
              containerModuleMetadataArrayFixture,
            );
        });

        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result =
              loadModuleMetadataTaskContextFixture.isMetadataArrayLoadable();
          });

          it(`should return ${expectedResult.toString()}`, () => {
            expect(result).toBe(expectedResult);
          });
        });
      },
    );
  });

  describe('.getZeroDependenciesMetadata', () => {
    describe.each<
      [string, () => ContainerModuleMetadata[], () => ContainerModuleMetadata[]]
    >([
      [
        'with no elements',
        (): ContainerModuleMetadata[] => [],
        (): ContainerModuleMetadata[] => [],
      ],
      [
        'with metadata with no dependencies',
        (): ContainerModuleMetadata[] => [
          ContainerModuleMetadataMocks.withRequiresEmptyArray,
        ],
        (): ContainerModuleMetadata[] => [
          {
            ...ContainerModuleMetadataMocks.withRequiresEmptyArray,
            factory: expect.anything() as unknown as (
              ...args: unknown[]
            ) => ContainerModule | Promise<ContainerModule>,
          },
        ],
      ],
      [
        'with metadata with referenced dependencies',
        buildMetadataArrayWithReferencedDependencies,
        (): ContainerModuleMetadata[] => [
          {
            ...buildMetadataArrayWithReferencedDependencies()[0],
            factory: expect.anything() as unknown as (
              ...args: unknown[]
            ) => ContainerModule | Promise<ContainerModule>,
          },
        ],
      ],
    ])(
      'having a LoadModuleMetadataTaskContext with ContainerModuleMetadata[] %s',
      (
        _: string,
        containerModuleMetadataArrayFixtureBuilder: () => ContainerModuleMetadata[],
        expectedResultBuilder: () => ContainerModuleMetadata[],
      ) => {
        let loadModuleMetadataTaskContextFixture: LoadModuleMetadataTaskContext;

        beforeAll(() => {
          const containerModuleMetadataArrayFixture: ContainerModuleMetadata[] =
            containerModuleMetadataArrayFixtureBuilder();

          const createInstanceTaskContextFixture: CreateInstanceTaskContext =
            Symbol() as unknown as CreateInstanceTaskContext;

          loadModuleMetadataTaskContextFixture =
            new LoadModuleMetadataTaskContext(
              createInstanceTaskContextFixture,
              containerModuleMetadataArrayFixture,
            );
        });

        describe('when called', () => {
          let expectedResult: ContainerModuleMetadata[];
          let result: unknown;

          beforeAll(() => {
            expectedResult = expectedResultBuilder();
            result =
              loadModuleMetadataTaskContextFixture.getZeroDependenciesMetadata();
          });

          it(`should return a ContainerModuleMetadata[]`, () => {
            expect(result).toStrictEqual(expectedResult);
          });
        });
      },
    );
  });

  describe('.processMetadataLoaded', () => {
    describe.each<
      [
        string,
        () => ContainerModuleMetadata[],
        () => ContainerModuleMetadata,
        () => ContainerModuleMetadata[],
      ]
    >([
      [
        'with no elements',
        (): ContainerModuleMetadata[] => [],
        (): ContainerModuleMetadata => ContainerModuleMetadataMocks.any,
        (): ContainerModuleMetadata[] => [],
      ],
      [
        'with metadata with no dependencies',
        (): ContainerModuleMetadata[] => [
          ContainerModuleMetadataMocks.withRequiresEmptyArray,
        ],
        (): ContainerModuleMetadata =>
          ContainerModuleMetadataMocks.withRequiresEmptyArray,
        (): ContainerModuleMetadata[] => [],
      ],
      [
        'with metadata with referenced dependencies',
        buildMetadataArrayWithReferencedDependencies,
        (): ContainerModuleMetadata =>
          buildMetadataArrayWithReferencedDependencies()[0],
        (): ContainerModuleMetadata[] => [
          {
            ...buildMetadataArrayWithReferencedDependencies()[1],
            factory: expect.any(Function) as unknown as (
              ...args: unknown[]
            ) => ContainerModule | Promise<ContainerModule>,
          },
        ],
      ],
    ])(
      'having a LoadModuleMetadataTaskContext with ContainerModuleMetadata[] %s',
      (
        _: string,
        containerModuleMetadataArrayFixtureBuilder: () => ContainerModuleMetadata[],
        containerModuleMetadataLoadedFixtureBuilder: () => ContainerModuleMetadata,
        expectedResultBuilder: () => ContainerModuleMetadata[],
      ) => {
        let loadModuleMetadataTaskContextFixture: LoadModuleMetadataTaskContext;

        beforeAll(() => {
          const containerModuleMetadataArrayFixture: ContainerModuleMetadata[] =
            containerModuleMetadataArrayFixtureBuilder();

          const createInstanceTaskContextFixture: CreateInstanceTaskContext =
            Symbol() as unknown as CreateInstanceTaskContext;

          loadModuleMetadataTaskContextFixture =
            new LoadModuleMetadataTaskContext(
              createInstanceTaskContextFixture,
              containerModuleMetadataArrayFixture,
            );
        });

        describe('when called', () => {
          beforeAll(() => {
            loadModuleMetadataTaskContextFixture.processMetadataLoaded(
              containerModuleMetadataLoadedFixtureBuilder(),
            );
          });

          describe('when called .getZeroDependenciesMetadata()', () => {
            let expectedResult: ContainerModuleMetadata[];
            let result: unknown;

            beforeAll(() => {
              expectedResult = expectedResultBuilder();
              result =
                loadModuleMetadataTaskContextFixture.getZeroDependenciesMetadata();
            });

            it(`should return a ContainerModuleMetadata[]`, () => {
              expect(result).toStrictEqual(expectedResult);
            });
          });
        });
      },
    );
  });
});
