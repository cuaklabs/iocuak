import * as cuaktask from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { Handler } from '../../../common/modules/domain/Handler';
import { mapIterable } from '../../../common/utils/mapIterable';
import { CreateCreateInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskNodeCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeExpandOperationContext';
import { CreateTagInstancesTaskNodeExpandCommand } from '../../models/cuaktask/CreateTagInstancesTaskNodeExpandCommand';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateTagInstancesTaskNodeExpandCommandHandler
  implements Handler<CreateTagInstancesTaskNodeExpandCommand, void>
{
  readonly #bindingService: BindingService;
  readonly #createCreateInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateInstanceTaskNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;

  constructor(
    bindingService: BindingService,
    createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
  ) {
    this.#bindingService = bindingService;
    this.#createCreateInstanceTaskGraphNodeCommandHandler =
      createCreateInstanceTaskGraphNodeCommandHandler;
  }

  public handle(
    createTagInstancesTaskGraphExpandCommand: CreateTagInstancesTaskNodeExpandCommand,
  ): void {
    const nodeDependencies: cuaktask.NodeDependencies<cuaktask.Task<TaskKind>> =
      this.#createCreateInstanceTaskGraphNodeDependencyFromTag(
        createTagInstancesTaskGraphExpandCommand.context,
        createTagInstancesTaskGraphExpandCommand.node.element.kind.tag,
      );

    createTagInstancesTaskGraphExpandCommand.node.dependencies =
      nodeDependencies;
  }

  #createCreateInstanceTaskGraphNodeDependencyFromBinding(
    context: CreateInstanceTaskNodeExpandOperationContext,
    binding: Binding,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const createInstanceTaskKind: CreateInstanceTaskKind = {
      binding: binding,
      requestId: context.requestId,
      type: TaskKindType.createInstance,
    };

    const createInstanceTaskKindGraphNodeDependency: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    > = this.#createCreateInstanceTaskGraphNodeDependencyFromTaskKind(
      context,
      createInstanceTaskKind,
    );

    return createInstanceTaskKindGraphNodeDependency;
  }

  #createCreateInstanceTaskGraphNodeDependencyFromTaskKind(
    context: CreateInstanceTaskNodeExpandOperationContext,
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const createCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskNodeCommand =
      {
        context: {
          ...context,
          taskKind: createInstanceTaskKind,
        },
      };

    const createInstanceTaskKindGraphNodeDependency: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    > = this.#createCreateInstanceTaskGraphNodeCommandHandler.handle(
      createCreateInstanceTaskGraphNodeCommand,
    );

    return createInstanceTaskKindGraphNodeDependency;
  }

  #createCreateInstanceTaskGraphNodeDependencyFromTag(
    context: CreateInstanceTaskNodeExpandOperationContext,
    tag: BindingTag,
  ): cuaktask.NodeDependencies<cuaktask.Task<TaskKind>> {
    const bindings: Iterable<Binding> = this.#getBindings(tag);

    const tagServiceNodes: Iterable<
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    > = mapIterable(bindings, (binding: Binding) =>
      this.#createCreateInstanceTaskGraphNodeDependencyFromBinding(
        context,
        binding,
      ),
    );

    const nodeDependency: cuaktask.AndNodeDependencies<
      cuaktask.Task<TaskKind>
    > = {
      nodes: [...tagServiceNodes],
      type: cuaktask.NodeDependenciesType.and,
    };

    return nodeDependency;
  }

  #getBindings(tag: BindingTag): Iterable<Binding> {
    const bindings: Iterable<Binding> = this.#bindingService.getByTag(
      tag,
      true,
    );

    return bindings;
  }
}
