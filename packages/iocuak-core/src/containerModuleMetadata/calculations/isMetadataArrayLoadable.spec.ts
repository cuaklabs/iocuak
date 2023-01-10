import { beforeAll, describe, expect, it } from '@jest/globals';

import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadataMocks } from '../mocks/models/ContainerModuleMetadataMocks';
import { ContainerModuleMetadata } from '../models/ContainerModuleMetadata';
import { isMetadataArrayLoadable } from './isMetadataArrayLoadable';

function buildMetadataArrayWithCircularDependencies(): ContainerModuleMetadata[] {
  const containerModuleMetadataArray: ContainerModuleMetadata[] = [
    {
      ...ContainerModuleMetadataMocks.withIdAndRequiresEmptyArray,
      requires: [
        ContainerModuleMetadataMocks.withIdAndRequiresEmptyArray
          .id as ContainerModuleMetadataId,
      ],
    },
  ];

  return containerModuleMetadataArray;
}

function buildMetadataArrayWithReferencedDependencies(): ContainerModuleMetadata[] {
  const containerModuleMetadataArray: ContainerModuleMetadata[] = [
    ContainerModuleMetadataMocks.withIdAndRequiresEmptyArray,
    {
      ...ContainerModuleMetadataMocks.withNoId,
      requires: [
        ContainerModuleMetadataMocks.withIdAndRequiresEmptyArray
          .id as ContainerModuleMetadataId,
      ],
    },
  ];

  return containerModuleMetadataArray;
}

function buildMetadataArrayWithUnreferencedDependencies(): ContainerModuleMetadata[] {
  const containerModuleMetadataArray: ContainerModuleMetadata[] = [
    ContainerModuleMetadataMocks.withNoIdAndRequiresEmptyArray,
    {
      ...ContainerModuleMetadataMocks.withNoId,
      requires: ['unreferenced-id'],
    },
  ];

  return containerModuleMetadataArray;
}

function buildMetadataArrayWithChainAndUnreferencedDependency(): ContainerModuleMetadata[] {
  const firstId: ContainerModuleMetadataId = 'first-id';
  const secondId: ContainerModuleMetadataId = 'second-id';
  const unreferencedId: ContainerModuleMetadataId = 'unreferenced-id';

  const containerModuleMetadataArray: ContainerModuleMetadata[] = [
    {
      ...ContainerModuleMetadataMocks.withNoIdAndRequiresEmptyArray,
      id: firstId,
    },
    {
      ...ContainerModuleMetadataMocks.withNoIdAndRequiresEmptyArray,
      id: secondId,
      requires: [firstId],
    },
    {
      ...ContainerModuleMetadataMocks.withNoId,
      requires: [secondId],
    },
    {
      ...ContainerModuleMetadataMocks.withNoId,
      requires: [unreferencedId],
    },
  ];

  return containerModuleMetadataArray;
}

describe(isMetadataArrayLoadable.name, () => {
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
    'having a ContainerModuleMetadata[] %s',
    (
      _: string,
      containerModuleMetadataArrayFixtureBuilder: () => ContainerModuleMetadata[],
      expectedResult: boolean,
    ) => {
      let containerModuleMetadataArrayFixture: ContainerModuleMetadata[];

      beforeAll(() => {
        containerModuleMetadataArrayFixture =
          containerModuleMetadataArrayFixtureBuilder();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = isMetadataArrayLoadable(containerModuleMetadataArrayFixture);
        });

        it(`should return ${expectedResult.toString()}`, () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
