import * as cuaktask from '@cuaklabs/cuaktask';

import { ContainerModuleCreateInstancesTaskKindMocks } from '../mocks/models/domain/ContainerModuleCreateInstancesTaskKindMocks';
import { ContainerModuleLoadFromMetadataTaskKindMocks } from '../mocks/models/domain/ContainerModuleLoadFromMetadataTaskKindMocks';
import { ContainerModuleMetadataMocks } from '../mocks/models/domain/ContainerModuleMetadataMocks';
import { ContainerModuleClassMetadata } from '../models/domain/ContainerModuleClassMetadata';
import { ContainerModuleCreateInstancesTaskKind } from '../models/domain/ContainerModuleCreateInstancesTaskKind';
import { ContainerModuleFactoryMetadata } from '../models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleLoadFromMetadataTaskKind } from '../models/domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleMetadata } from '../models/domain/ContainerModuleMetadata';
import { ContainerModuleTaskKind } from '../models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskKindType } from '../models/domain/ContainerModuleTaskKindType';
import { ContainerModuleTaskDependencyEngine } from './ContainerModuleTaskDependencyEngine';

describe(ContainerModuleTaskDependencyEngine.name, () => {
  let containerModuleTaskDependencyEngine: ContainerModuleTaskDependencyEngine;

  beforeAll(() => {
    containerModuleTaskDependencyEngine =
      new ContainerModuleTaskDependencyEngine();
  });

  describe('.getDependencies', () => {
    describe('having a task kind of type createInstances', () => {
      let taskKindFixture: ContainerModuleCreateInstancesTaskKind;

      beforeAll(() => {
        taskKindFixture = ContainerModuleCreateInstancesTaskKindMocks.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            containerModuleTaskDependencyEngine.getDependencies(
              taskKindFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an error', () => {
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: 'Unsupported type',
            }),
          );
        });
      });
    });

    describe('having a task kind with class metadata', () => {
      let taskKindFixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleClassMetadata>;

      beforeAll(() => {
        taskKindFixture =
          ContainerModuleLoadFromMetadataTaskKindMocks.withMetadataContainerModuleClassMetadata;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            containerModuleTaskDependencyEngine.getDependencies(
              taskKindFixture,
            );
        });

        it('should return a task kind graph', () => {
          const expectedTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [],
            kind: taskKindFixture,
          };

          const expectedTaskKindGraph: cuaktask.TaskDependencyKindGraph<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            nodes: [expectedTaskKindGraphNode],
            rootNode: expectedTaskKindGraphNode,
          };

          expect(result).toStrictEqual(expectedTaskKindGraph);
        });
      });
    });

    describe('having a task kind with factory metadata with no imports nor injects', () => {
      let taskKindFixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata>;

      beforeAll(() => {
        taskKindFixture =
          ContainerModuleLoadFromMetadataTaskKindMocks.withMetadataWithImportsEmptyAndInjectsEmpty;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            containerModuleTaskDependencyEngine.getDependencies(
              taskKindFixture,
            );
        });

        it('should return a task kind graph', () => {
          const expectedTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [],
            kind: taskKindFixture,
          };

          const expectedTaskKindGraph: cuaktask.TaskDependencyKindGraph<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            nodes: [expectedTaskKindGraphNode],
            rootNode: expectedTaskKindGraphNode,
          };

          expect(result).toStrictEqual(expectedTaskKindGraph);
        });
      });
    });

    describe('having a task kind with factory metadata with no imports and injects', () => {
      let taskKindFixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata>;

      beforeAll(() => {
        taskKindFixture =
          ContainerModuleLoadFromMetadataTaskKindMocks.withMetadataWithImportsEmptyAndInjectsWithOneServiceId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            containerModuleTaskDependencyEngine.getDependencies(
              taskKindFixture,
            );
        });

        it('should return a task kind graph', () => {
          const expectedCreateInstancesTaskNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [],
            kind: {
              serviceIds: taskKindFixture.metadata.injects,
              type: ContainerModuleTaskKindType.createInstances,
            },
          };
          const expectedTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [expectedCreateInstancesTaskNode],
            kind: taskKindFixture,
          };

          const expectedTaskKindGraph: cuaktask.TaskDependencyKindGraph<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            nodes: [expectedTaskKindGraphNode, expectedCreateInstancesTaskNode],
            rootNode: expectedTaskKindGraphNode,
          };

          expect(result).toStrictEqual(expectedTaskKindGraph);
        });
      });
    });

    describe('having a task kind with factory metadata with imports and no injects', () => {
      let containerModuleMetadataFixture: ContainerModuleFactoryMetadata;
      let dependencyContainerModuleMetadataFixture: ContainerModuleMetadata;
      let taskKindFixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata>;

      beforeAll(() => {
        dependencyContainerModuleMetadataFixture =
          ContainerModuleMetadataMocks.withImportsEmptyAndInjectsEmpty;

        containerModuleMetadataFixture = {
          ...ContainerModuleMetadataMocks.withImportsEmptyAndInjectsEmpty,
          imports: [dependencyContainerModuleMetadataFixture],
        };

        taskKindFixture = {
          ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
          metadata: containerModuleMetadataFixture,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            containerModuleTaskDependencyEngine.getDependencies(
              taskKindFixture,
            );
        });

        it('should return a task kind graph', () => {
          const expectedDependencyTaskNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [],
            kind: {
              metadata: dependencyContainerModuleMetadataFixture,
              type: ContainerModuleTaskKindType.loadFromMetadata,
            },
          };
          const expectedTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [expectedDependencyTaskNode],
            kind: taskKindFixture,
          };

          const expectedTaskKindGraph: cuaktask.TaskDependencyKindGraph<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            nodes: [expectedTaskKindGraphNode, expectedDependencyTaskNode],
            rootNode: expectedTaskKindGraphNode,
          };

          expect(result).toStrictEqual(expectedTaskKindGraph);
        });
      });
    });

    describe('having a task kind with factory metadata with imports and injects', () => {
      let containerModuleMetadataFixture: ContainerModuleFactoryMetadata;
      let dependencyContainerModuleMetadataFixture: ContainerModuleMetadata;
      let taskKindFixture: ContainerModuleLoadFromMetadataTaskKind<ContainerModuleFactoryMetadata>;

      beforeAll(() => {
        dependencyContainerModuleMetadataFixture =
          ContainerModuleMetadataMocks.withImportsEmptyAndInjectsEmpty;

        containerModuleMetadataFixture = {
          ...ContainerModuleMetadataMocks.withImportsEmptyAndInjectsWithOneServiceId,
          imports: [dependencyContainerModuleMetadataFixture],
        };

        taskKindFixture = {
          ...ContainerModuleLoadFromMetadataTaskKindMocks.any,
          metadata: containerModuleMetadataFixture,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            containerModuleTaskDependencyEngine.getDependencies(
              taskKindFixture,
            );
        });

        it('should return a task kind graph', () => {
          const expectedDependencyTaskNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [],
            kind: {
              metadata: dependencyContainerModuleMetadataFixture,
              type: ContainerModuleTaskKindType.loadFromMetadata,
            },
          };
          const expectedCreateInstancesTaskNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [expectedDependencyTaskNode],
            kind: {
              serviceIds: taskKindFixture.metadata.injects,
              type: ContainerModuleTaskKindType.createInstances,
            },
          };
          const expectedTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            dependencies: [expectedCreateInstancesTaskNode],
            kind: taskKindFixture,
          };

          const expectedTaskKindGraph: cuaktask.TaskDependencyKindGraph<
            ContainerModuleTaskKind,
            ContainerModuleTaskKind
          > = {
            nodes: [
              expectedTaskKindGraphNode,
              expectedCreateInstancesTaskNode,
              expectedDependencyTaskNode,
            ],
            rootNode: expectedTaskKindGraphNode,
          };

          expect(result).toStrictEqual(expectedTaskKindGraph);
        });
      });
    });
  });
});
